const table = document.querySelector('.product-table');
const productRows = document.getElementById('productRows');
const emptyState = document.getElementById('emptyState');
const skeletonGrid = document.getElementById('skeletonGrid');
const addProductButton = document.getElementById('addProductButton');
const exportCsvButton = document.getElementById('exportCsvButton');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const cancelForm = document.getElementById('cancelForm');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const totalProducts = document.getElementById('totalProducts');
const healthyStock = document.getElementById('healthyStock');
const stockValue = document.getElementById('stockValue');
const criticalCount = document.getElementById('criticalCount');
const chartRootElement = document.getElementById('stockHealthChart');

let products = [];
let editingProduct = null;
let chartRoot = null;

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function openModal(product = null) {
  editingProduct = product;
  modalOverlay.hidden = false;
  modalTitle.textContent = product ? 'Editar produto' : 'Adicionar produto';
  productForm.reset();

  if (product) {
    productForm.name.value = product.name;
    productForm.stockQuantity.value = product.stockQuantity;
    productForm.price.value = product.price;
    productForm.minStockLevel.value = product.minStockLevel;
  }
}

function closeModalPanel() {
  modalOverlay.hidden = true;
  editingProduct = null;
}

function getStatus(product) {
  return product.stockQuantity <= product.minStockLevel ? 'CRÍTICO' : 'OK';
}

function renderRows(items) {
  productRows.innerHTML = '';

  if (!items.length) {
    table.hidden = true;
    emptyState.hidden = false;
    return;
  }

  table.hidden = false;
  emptyState.hidden = true;

  items.forEach((product) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>
        <div class="product-title">
          <strong>${product.name}</strong>
          <span>ID ${product.id} • Criado em ${product.createdAt ? new Date(product.createdAt).toLocaleDateString('pt-BR') : '—'}</span>
        </div>
      </td>
      <td>${product.stockQuantity}</td>
      <td>${formatCurrency(Number(product.price))}</td>
      <td>${product.minStockLevel}</td>
      <td>
        <span class="status-pill ${getStatus(product) === 'CRÍTICO' ? 'status-critical' : 'status-normal'}">
          ${getStatus(product) === 'CRÍTICO' ? '<span class="status-dot"></span>' : ''}
          ${getStatus(product)}
        </span>
      </td>
      <td>
        <div class="row-actions">
          <button class="action-button" data-action="edit" data-id="${product.id}">Editar</button>
          <button class="action-button" data-action="delete" data-id="${product.id}">Excluir</button>
        </div>
      </td>
    `;

    productRows.appendChild(row);
  });
}

function renderMetrics(items) {
  const total = items.length;
  const critical = items.filter((product) => product.stockQuantity <= product.minStockLevel).length;
  const healthy = total - critical;
  const value = items.reduce((sum, product) => sum + Number(product.price) * Number(product.stockQuantity), 0);

  totalProducts.textContent = total;
  healthyStock.textContent = healthy;
  stockValue.textContent = formatCurrency(value);
  criticalCount.textContent = critical;
}

function showProducts() {
  renderRows(products);
  renderMetrics(products);
  renderStockHealthChart(products);
}

function initializeChart() {
  if (chartRoot || !window.ReactDOM || !chartRootElement) return;
  chartRoot = ReactDOM.createRoot(chartRootElement);
}

function renderStockHealthChart(items) {
  if (!window.Recharts || !window.React || !window.ReactDOM || !chartRootElement) return;

  const critical = items.filter((product) => product.stockQuantity <= product.minStockLevel).length;
  const healthy = items.length - critical;
  const data = [
    { name: 'Estável', value: healthy },
    { name: 'Reposição', value: critical },
  ];

  initializeChart();

  const { PieChart, Pie, Cell, ResponsiveContainer } = Recharts;
  const COLORS = ['#4f46e5', '#f97316'];

  chartRoot.render(
    React.createElement(
      ResponsiveContainer,
      { width: '100%', height: 280 },
      React.createElement(
        PieChart,
        null,
        React.createElement(
          Pie,
          {
            data,
            dataKey: 'value',
            innerRadius: 72,
            outerRadius: 110,
            startAngle: 90,
            endAngle: -270,
            paddingAngle: 4,
            stroke: 'transparent',
          },
          data.map((entry, index) => React.createElement(Cell, { key: `cell-${index}`, fill: COLORS[index] }))
        )
      )
    )
  );
}

function exportCsv() {
  if (!products.length) {
    alert('Não há produtos para exportar.');
    return;
  }

  const headers = ['ID', 'Nome', 'Estoque', 'Preço', 'Nível mínimo', 'Status'];
  const rows = products.map((product) => [
    product.id,
    product.name,
    product.stockQuantity,
    Number(product.price).toFixed(2),
    product.minStockLevel,
    product.stockQuantity <= product.minStockLevel ? 'CRÍTICO' : 'OK',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'produtos-vantage.csv';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function fetchProducts() {
  fetch('/api/products')
    .then((res) => res.json())
    .then((data) => {
      products = data;
      skeletonGrid.hidden = true;
      showProducts();
    })
    .catch(() => {
      skeletonGrid.hidden = true;
      productRows.innerHTML = '';
      table.hidden = true;
      emptyState.hidden = false;
      emptyState.innerHTML = '<div class="empty-icon">⚠️</div><strong>Erro ao carregar dados</strong><p>Verifique sua conexão com a API e tente novamente.</p>';
    });
}

function updateProduct(product) {
  const method = editingProduct ? 'PUT' : 'POST';
  const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
    .then((res) => res.json())
    .then(() => {
      closeModalPanel();
      fetchProducts();
    });
}

productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const payload = {
    name: productForm.name.value.trim(),
    stockQuantity: Number(productForm.stockQuantity.value),
    price: Number(productForm.price.value),
    minStockLevel: Number(productForm.minStockLevel.value),
  };

  updateProduct(payload);
});

addProductButton.addEventListener('click', () => openModal());
exportCsvButton.addEventListener('click', exportCsv);
closeModal.addEventListener('click', closeModalPanel);
cancelForm.addEventListener('click', closeModalPanel);
modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) closeModalPanel();
});

productRows.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;
  const product = products.find((item) => String(item.id) === String(id));

  if (action === 'edit') {
    openModal(product);
    return;
  }

  if (action === 'delete' && confirm('Tem certeza que deseja excluir este produto?')) {
    fetch(`/api/products/${id}`, { method: 'DELETE' })
      .then(() => fetchProducts())
      .catch(() => alert('Erro ao excluir produto.'));
  }
});

window.addEventListener('DOMContentLoaded', fetchProducts);

window.addEventListener('DOMContentLoaded', fetchProducts);
