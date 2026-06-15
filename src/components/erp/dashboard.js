export function renderDashboard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="dashboard-container">
      
      <!-- Metrics Overview -->
      <section>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon"><i class="ri-wallet-3-line"></i></div>
            <div class="metric-value">$24,500</div>
            <div class="metric-label">Total Revenue</div>
          </div>
          <div class="metric-card success">
            <div class="metric-icon"><i class="ri-shopping-cart-2-line"></i></div>
            <div class="metric-value">142</div>
            <div class="metric-label">New Orders</div>
          </div>
          <div class="metric-card warning">
            <div class="metric-icon"><i class="ri-box-3-line"></i></div>
            <div class="metric-value">18</div>
            <div class="metric-label">Low Stock Items</div>
          </div>
          <div class="metric-card">
            <div class="metric-icon"><i class="ri-group-line"></i></div>
            <div class="metric-value">1,240</div>
            <div class="metric-label">Active Clients</div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section>
        <h3 class="section-title">Quick Actions <i class="ri-more-2-line text-muted"></i></h3>
        <div class="quick-actions no-scrollbar">
          <button class="action-btn">
            <div class="action-icon"><i class="ri-file-add-line"></i></div>
            <span class="action-label">Invoice</span>
          </button>
          <button class="action-btn">
            <div class="action-icon"><i class="ri-user-add-line"></i></div>
            <span class="action-label">Client</span>
          </button>
          <button class="action-btn">
            <div class="action-icon"><i class="ri-truck-line"></i></div>
            <span class="action-label">Shipment</span>
          </button>
          <button class="action-btn">
            <div class="action-icon"><i class="ri-pie-chart-line"></i></div>
            <span class="action-label">Report</span>
          </button>
        </div>
      </section>

      <!-- Recent Activity -->
      <section>
        <h3 class="section-title">Recent Activity</h3>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon" style="color: var(--accent-success); background: rgba(16, 185, 129, 0.1);"><i class="ri-arrow-right-up-line"></i></div>
            <div class="activity-content">
              <div class="activity-title">Payment Received</div>
              <div class="activity-time">Today, 10:45 AM &bull; Invoice #1024</div>
            </div>
            <div class="activity-status text-success">+$1,200</div>
          </div>
          <div class="activity-item">
            <div class="activity-icon" style="color: var(--accent-primary); background: var(--accent-primary-alpha);"><i class="ri-box-1-line"></i></div>
            <div class="activity-content">
              <div class="activity-title">Inventory Restocked</div>
              <div class="activity-time">Today, 09:12 AM &bull; Electronics</div>
            </div>
            <div class="activity-status">50 Units</div>
          </div>
          <div class="activity-item">
            <div class="activity-icon" style="color: var(--accent-warning); background: rgba(245, 158, 11, 0.1);"><i class="ri-error-warning-line"></i></div>
            <div class="activity-content">
              <div class="activity-title">Low Stock Alert</div>
              <div class="activity-time">Yesterday &bull; Office Supplies</div>
            </div>
            <div class="activity-status text-warning">Action Req.</div>
          </div>
        </div>
      </section>

    </div>
  `;
}
