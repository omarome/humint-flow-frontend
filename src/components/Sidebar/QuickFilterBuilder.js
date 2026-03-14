import React from 'react';
import { 
  LucideZap, 
  LucidePlusCircle, 
  LucideFilter, 
  LucideUsers, 
  LucideClock, 
  LucideTrendingDown, 
  LucideUserMinus,
  LucideArrowRight 
} from 'lucide-react';
import '../../styles/QuickFilterBuilder.less';

const QuickFilterBuilder = () => {
  return (
    <aside className="quick-filter-sidebar">
      {/* Quick Filter Builder Card */}
      <div className="sidebar-card">
        <div className="card-header">
          <h2 className="card-title">Quick Filter Builder</h2>
          <LucideZap size={16} className="title-icon zap-icon" />
        </div>
        <div className="card-body">
          <div className="filter-field">
            <label className="field-label">User Status</label>
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input type="checkbox" defaultChecked />
                <span className="badge badge-active">Active</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" />
                <span className="badge badge-inactive">Inactive</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" />
                <span className="badge badge-pending">Pending</span>
              </label>
            </div>
          </div>

          <div className="filter-field">
            <label className="field-label">Age Range</label>
            <div className="range-inputs">
              <input type="number" placeholder="Min" className="filter-input" />
              <span className="range-separator">-</span>
              <input type="number" placeholder="Max" className="filter-input" />
            </div>
          </div>

          <div className="filter-field">
            <label className="field-label">Last Login</label>
            <select className="filter-select">
              <option value="">Anytime</option>
              <option value="7d">Within last 7 days</option>
              <option value="30d">Within last 30 days</option>
              <option value="90d">Within last 90 days</option>
            </select>
          </div>

          <div className="filter-field">
            <label className="field-label">User Type</label>
            <select className="filter-select">
              <option value="">All Types</option>
              <option value="student">Student</option>
              <option value="employee">Employee</option>
              <option value="unemployed">Unemployed</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <button className="apply-btn">
            Apply Quick Filters
            <LucideArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Saved Filters Card */}
      <div className="sidebar-card">
        <div className="card-header">
          <h2 className="card-title">Saved Filters</h2>
          <button className="add-filter-btn">
            <LucidePlusCircle size={16} />
          </button>
        </div>
        <nav className="saved-filters-nav">
          <button className="nav-item active">
            <div className="nav-label-group">
              <LucideFilter size={14} />
              <span className="badge badge-active">Active Users</span>
            </div>
            <span className="applied-pill">Applied</span>
          </button>
          <button className="nav-item">
            <div className="nav-label-group">
              <LucideUsers size={14} />
              <span>Marketing Leads</span>
            </div>
          </button>
          <button className="nav-item">
            <div className="nav-label-group">
              <LucideClock size={14} />
              <span>Recent Signups</span>
            </div>
          </button>
          <button className="nav-item">
            <div className="nav-label-group">
              <LucideTrendingDown size={14} />
              <span>Churn Risk (High)</span>
            </div>
          </button>
          <button className="nav-item">
            <div className="nav-label-group">
              <LucideUserMinus size={14} />
              <span className="badge badge-inactive">Inactive 30+ Days</span>
            </div>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default QuickFilterBuilder;
