import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { LayoutDashboard, Package, AlertTriangle, DollarSign, Search, Plus, Trash2, Edit3, ChevronRight, X } from 'lucide-react'

const initialFormState = {
  name: '',
  price: '',
  stockQuantity: '',
  minStockLevel: '',
}

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apiConnectionLost, setApiConnectionLost] = useState(false)
  const [search, setSearch] = useState(() => localStorage.getItem('vantage-erp-search') || '')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editingProduct, setEditingProduct] = useState(null)
  const [formValues, setFormValues] = useState(initialFormState)
  const nameInputRef = useRef(null)
  const previousApiConnectionLost = useRef(false)
  const viteApiUrl = import.meta.env.VITE_API_URL
  const API_URL = viteApiUrl || '/api'
  const isMissingEnv = !viteApiUrl && import.meta.env.PROD

  const [predictions, setPredictions] = useState({})
  const [forecastSummary, setForecastSummary] = useState([])

  const handleSearchChange = (value) => {
    localStorage.setItem('vantage-erp-search', value)
    setSearch(value)
  }

  const loadPredictions = useCallback(async (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      setPredictions({})
      return
    }

    const criticalItems = items.filter((product) => product.stockQuantity <= product.minStockLevel)
    if (criticalItems.length === 0) {
      setPredictions({})
      return
    }

    const nextPredictions = {}
    await Promise.all(
      criticalItems.map(async (product) => {
        try {
          const response = await axios.get(`${API_URL}/products/${product.id}/predict`)
          nextPredictions[product.id] = response.data
        } catch (predictionError) {
          console.error('Falha ao buscar previsão de IA:', predictionError)
        }
      })
    )
    setPredictions(nextPredictions)
  }, [API_URL])

  const loadForecastSummary = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/products/forecast-summary`)
      setForecastSummary(response.data ?? [])
    } catch (summaryError) {
      console.error('Falha ao carregar resumo de previsão:', summaryError)
      setForecastSummary([])
    }
  }, [API_URL])

  const getServerErrorMessage = useCallback((error) => {
    if (!error?.response?.data) return null
    const data = error.response.data
    if (typeof data === 'string') return data
    if (typeof data.message === 'string') return data.message
    if (typeof data.error === 'string') return data.error
    if (typeof data.errors === 'object' && data.errors !== null) {
      return Object.values(data.errors)
        .flat()
        .filter(Boolean)
        .join(' ')
    }
    return JSON.stringify(data)
  }, [])

  const checkApiStatus = useCallback(async () => {
    try {
      await axios.get(`${API_URL}/products`, { timeout: 3000 })
      setApiConnectionLost(false)
    } catch (healthError) {
      console.error('API health check falhou:', healthError)
      setApiConnectionLost(true)
    }
  }, [API_URL])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/products`)
      const productList = response.data ?? []
      setProducts(productList)
      await loadPredictions(productList)
      await loadForecastSummary()
      setError(null)
      setApiConnectionLost(false)
      return true
    } catch (fetchError) {
      console.error('Erro ao buscar:', fetchError)
      const message = getServerErrorMessage(fetchError)
      setError(message || 'Não foi possível carregar os produtos.')
      if (!fetchError.response) setApiConnectionLost(true)
      return false
    } finally {
      setLoading(false)
    }
  }, [API_URL, getServerErrorMessage, loadPredictions, loadForecastSummary])

  const handleRetry = async () => {
    setError(null)
    setLoading(true)
    await fetchProducts()
    await checkApiStatus()
  }

  if (isMissingEnv) {
    return (
      <div className="min-h-screen bg-red-50 text-gray-900 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl rounded-3xl border border-red-200 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-red-700">Erro de configuração do ambiente</h1>
          <p className="mt-4 text-sm text-gray-600">
            A variável <code className="rounded bg-gray-100 px-2 py-1">VITE_API_URL</code> não está definida.
            Configure o endpoint do backend no Vercel e redeploy a aplicação.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Dica: no painel Vercel, adicione <code>VITE_API_URL</code> nas Environment Variables apontando para seu backend Render.
          </p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    void (async () => {
      try {
        const success = await fetchProducts()
        await checkApiStatus()
        if (!success) {
          throw new Error('Falha no carregamento inicial')
        }
      } catch (initialError) {
        console.error('Erro no carregamento inicial:', initialError)
        setError((prevError) => prevError || 'Erro no carregamento inicial. Tente novamente.')
      }
    })()
  }, [fetchProducts, checkApiStatus])

  useEffect(() => {
    if (modalOpen && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [modalOpen])

  useEffect(() => {
    if (previousApiConnectionLost.current && !apiConnectionLost) {
      toast.success('Conexão restabelecida!')
    }
    previousApiConnectionLost.current = apiConnectionLost
  }, [apiConnectionLost])

  useEffect(() => {
    if (!apiConnectionLost) return
    const interval = setInterval(checkApiStatus, 5000)
    return () => clearInterval(interval)
  }, [apiConnectionLost, checkApiStatus])

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 400) {
          const message = getServerErrorMessage(error) || 'Erro de validação no servidor.'
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )

    return () => axios.interceptors.response.eject(interceptor)
  }, [getServerErrorMessage])

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim()
    return products.filter((product) =>
      product.name.toLowerCase().includes(term) || String(product.id).includes(term)
    )
  }, [products, search])

  const totalStock = useMemo(
    () => products.reduce((acc, p) => acc + (p.stockQuantity ?? 0), 0),
    [products]
  )

  const totalValue = useMemo(
    () => products.reduce((acc, p) => acc + ((p.price ?? 0) * (p.stockQuantity ?? 0)), 0),
    [products]
  )

  const lowStockCount = useMemo(
    () => products.filter((p) => p.stockQuantity <= p.minStockLevel).length,
    [products]
  )

  const openCreateModal = () => {
    setModalMode('create')
    setEditingProduct(null)
    setFormValues(initialFormState)
    setModalOpen(true)
  }

  const openEditModal = (product) => {
    setModalMode('edit')
    setEditingProduct(product)
    setFormValues({
      name: product.name,
      price: String(product.price ?? ''),
      stockQuantity: String(product.stockQuantity ?? ''),
      minStockLevel: String(product.minStockLevel ?? ''),
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingProduct(null)
    setFormValues(initialFormState)
  }

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

  const isValidName = formValues.name.trim().length >= 3
  const isValidPrice = Number(formValues.price) > 0
  const isValidStock = Number.isInteger(Number(formValues.stockQuantity)) && Number(formValues.stockQuantity) > 0
  const isValidMinStock = Number.isInteger(Number(formValues.minStockLevel)) && Number(formValues.minStockLevel) >= 0
  const isFormValid = isValidName && isValidPrice && isValidStock && isValidMinStock

  const handleSaveProduct = async () => {
    const payload = {
      name: formValues.name.trim(),
      price: Number(formValues.price),
      stockQuantity: Number(formValues.stockQuantity),
      minStockLevel: Number(formValues.minStockLevel),
    }

    try {
      if (modalMode === 'create') {
        await axios.post(`${API_URL}/products`, payload)
        toast.success('Produto criado com sucesso.')
      } else if (editingProduct) {
        await axios.put(`${API_URL}/products/${editingProduct.id}`, payload)
        toast.success('Produto atualizado com sucesso.')
      }
      closeModal()
      fetchProducts()
      setApiConnectionLost(false)
    } catch (saveError) {
      console.error('Erro ao salvar:', saveError)
      const message = getServerErrorMessage(saveError) || 'Falha ao salvar o produto.'
      toast.error(message)
      if (!saveError.response) setApiConnectionLost(true)
    }
  }

  const handleDeleteProduct = async (product) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir "${product.name}"?`)
    if (!confirmDelete) return

    try {
      await axios.delete(`${API_URL}/products/${product.id}`)
      toast.success('Produto deletado com sucesso.')
      fetchProducts()
      setApiConnectionLost(false)
    } catch (deleteError) {
      console.error('Erro ao deletar:', deleteError)
      const message = getServerErrorMessage(deleteError) || 'Falha ao deletar o produto.'
      toast.error(message)
      if (!deleteError.response) setApiConnectionLost(true)
    }
  }

  const hasCriticalStock = (product) => product.stockQuantity <= product.minStockLevel

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="fixed inset-0 -z-10 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-gray-200 bg-white">
          <div className="px-8 py-10">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold font-serif text-gray-900">Vantage</h1>
              <p className="text-sm text-gray-500">Gestão inteligente de estoque</p>
            </div>
          </div>
          <nav className="flex-1 px-6 py-8 space-y-2">
            <button type="button" className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 px-4 py-3 text-gray-900 font-medium hover:from-teal-100 hover:to-blue-100 transition">
              <LayoutDashboard size={18} className="text-teal-600" /> Dashboard
            </button>
            <button type="button" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition">
              <Package size={18} /> Inventário
            </button>
            <button type="button" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition">
              <DollarSign size={18} /> Vendas
            </button>
          </nav>
          <div className="px-6 pb-8">
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-teal-50 to-blue-50 p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-900">Dica Premium</p>
              <p className="text-xs text-gray-600">Monitore seu estoque em tempo real e receba alertas automáticos.</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gradient-to-br from-teal-600 to-blue-600 p-3 text-white shadow-lg shadow-teal-200">
                  <LayoutDashboard size={22} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Gerenciamento</p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900">Seus produtos</h2>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    value={search}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    placeholder="Buscar produtos..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-10 py-2.5 text-sm text-gray-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 transition"
                >
                  <Plus size={18} /> Adicionar
                </button>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {forecastSummary.length > 0 && (
              <div className="mb-6 rounded-3xl border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm text-yellow-900 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={18} className="text-yellow-700" />
                  <div>
                    <p className="font-semibold">Atenção Vantage AI</p>
                    <p className="text-xs text-yellow-700/80">{forecastSummary.length} produto(s) com ruptura prevista em menos de 7 dias.</p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase text-yellow-700">Verifique agora</span>
              </div>
            )}
            {apiConnectionLost && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm flex items-center gap-3">
              <AlertTriangle size={18} />
              <span>Conexão perdida. Verifique o status do servidor.</span>
            </div>
          )}

          {error && !apiConnectionLost && (
            <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700 shadow-sm">
              {error}
            </div>
          )}

          {!loading && products.length === 0 && (apiConnectionLost || error) && (
            <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sem dados</p>
              <h3 className="mt-3 text-2xl font-bold text-gray-900">Não foi possível carregar o painel</h3>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                A conexão com a API falhou ou o servidor está offline. Recarregue quando o backend estiver disponível.
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Tentar novamente
              </button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-elegant hover:shadow-lg transition">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total de produtos</p>
                <p className="mt-4 text-4xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-elegant hover:shadow-lg transition">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Valor total</p>
                <p className="mt-4 text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">{formatCurrency(totalValue)}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-elegant hover:shadow-lg transition">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Unidades em estoque</p>
                <p className="mt-4 text-4xl font-bold text-gray-900">{totalStock}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-elegant hover:shadow-lg transition">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Itens críticos</p>
                <p className="mt-4 text-4xl font-bold text-red-600">{lowStockCount}</p>
              </div>
            </div>

            <section className="mt-8">
              <div className="rounded-xl border border-gray-200 bg-white shadow-elegant overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Tabela de produtos</h3>
                      <p className="mt-1 text-sm text-gray-500">Gerenciar e monitorar seu estoque</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                      <ChevronRight size={16} /> {filteredProducts.length} resultados
                    </div>
                  </div>
                </div>

                <div className="mt-0 hidden lg:block overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-900">Produto</th>
                        <th className="px-6 py-3 font-semibold text-gray-900">Preço</th>
                        <th className="px-6 py-3 font-semibold text-gray-900">Estoque</th>
                        <th className="px-6 py-3 font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-900">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="py-24">
                            <div className="flex justify-center">
                              <div className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-teal-600 animate-spin" />
                            </div>
                          </td>
                        </tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-24 text-center text-gray-400">Nenhum produto encontrado.</td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => {
                          const critical = hasCriticalStock(product)
                          return (
                            <tr key={product.id} className="hover:bg-gray-50 transition">
                              <td className="px-6 py-4">
                                <div className="font-semibold text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-400">ID {product.id}</div>
                              </td>
                              <td className="px-6 py-4 text-gray-700 font-medium">{formatCurrency(product.price)}</td>
                              <td className="px-6 py-4 text-gray-700">
                                <div className="mb-2 text-sm font-semibold">{product.stockQuantity} un.</div>
                                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                  <div className={`h-2 rounded-full ${critical ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (product.stockQuantity / Math.max(product.minStockLevel || 1, 1)) * 100)}%` }} />
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase ${critical ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                  {critical ? 'Crítico' : 'Estável'}
                                </span>
                                {critical && (
                                  <p className="mt-2 text-xs text-teal-700">
                                    IA Insight: {predictions[product.id]?.estimatedDaysToDepletion ?? 'carregando...'} dias
                                  </p>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <button type="button" onClick={() => openEditModal(product)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                                  <Edit3 size={16} />
                                </button>
                                <button type="button" onClick={() => handleDeleteProduct(product)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 lg:hidden p-6">
                  {loading ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-12 flex justify-center">
                      <div className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-teal-600 animate-spin" />
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center text-gray-400">Nenhum produto encontrado.</div>
                  ) : (
                    filteredProducts.map((product) => {
                      const critical = hasCriticalStock(product)
                      return (
                        <div key={product.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-400">ID {product.id}</p>
                            </div>
                            <div className="text-right">
                              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${critical ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {critical ? 'Crítico' : 'Estável'}
                              </span>
                              {critical && (
                                <p className="mt-2 text-[10px] text-teal-700">IA Insight: {predictions[product.id]?.estimatedDaysToDepletion ?? 'carregando...'} dias</p>
                              )}
                            </div>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg bg-white p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 font-semibold uppercase">Preço</p>
                              <p className="mt-1 font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                            </div>
                            <div className="rounded-lg bg-white p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 font-semibold uppercase">Estoque</p>
                              <p className="mt-1 font-semibold text-gray-900">{product.stockQuantity} un.</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => openEditModal(product)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
                              <Edit3 size={16} /> Editar
                            </button>
                            <button type="button" onClick={() => handleDeleteProduct(product)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition">
                              <Trash2 size={16} /> Deletar
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{modalMode === 'create' ? 'Novo produto' : 'Editar produto'}</h3>
                <p className="text-sm text-gray-500 mt-1">Preencha os dados para salvar as alterações.</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-gray-700">Nome do produto</span>
                <input
                  ref={nameInputRef}
                  value={formValues.name}
                  onChange={(event) => setFormValues({ ...formValues, name: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
                {!isValidName && formValues.name !== '' && (
                  <p className="text-xs text-red-600">Mínimo 3 caracteres</p>
                )}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-gray-700">Preço</span>
                <input
                  type="number"
                  step="0.01"
                  value={formValues.price}
                  onChange={(event) => setFormValues({ ...formValues, price: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
                {!isValidPrice && formValues.price !== '' && (
                  <p className="text-xs text-red-600">Deve ser maior que zero</p>
                )}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-gray-700">Quantidade</span>
                <input
                  type="number"
                  value={formValues.stockQuantity}
                  onChange={(event) => setFormValues({ ...formValues, stockQuantity: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
                {!isValidStock && formValues.stockQuantity !== '' && (
                  <p className="text-xs text-red-600">Inteiro positivo obrigatório</p>
                )}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-gray-700">Estoque mínimo</span>
                <input
                  type="number"
                  value={formValues.minStockLevel}
                  onChange={(event) => setFormValues({ ...formValues, minStockLevel: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
                {!isValidMinStock && formValues.minStockLevel !== '' && (
                  <p className="text-xs text-red-600">Zero ou maior</p>
                )}
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeModal} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={!isFormValid}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${isFormValid ? 'bg-gradient-to-r from-teal-600 to-blue-600 hover:shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                {modalMode === 'create' ? 'Criar produto' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
    </div>
  )
}

export default App
