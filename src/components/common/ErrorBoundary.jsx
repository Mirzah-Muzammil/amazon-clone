// src/components/common/ErrorBoundary.jsx
import React from 'react';

const CONTAINER_CLASSES =
  'rounded-xl border border-red-200 bg-red-50 p-6 text-red-900';
const TITLE_CLASSES = 'text-lg font-semibold';
const MESSAGE_CLASSES = 'mt-2 text-sm text-red-800';
const BUTTON_CLASSES =
  'mt-4 inline-flex items-center rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className={CONTAINER_CLASSES} role="alert">
        <h2 className={TITLE_CLASSES}>Something went wrong</h2>
        <p className={MESSAGE_CLASSES}>
          We hit an unexpected error. Try again or refresh the page.
        </p>
        <button
          type="button"
          className={BUTTON_CLASSES}
          onClick={this.handleReset}
        >
          Try again
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
