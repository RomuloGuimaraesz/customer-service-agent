/**
 * Pedidos Reducer - Manages pedidos state with useReducer
 * Provides predictable state updates for pedidos-related operations
 */

// Action Types
export const PEDIDOS_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE',
};

// Initial State
export const initialPedidosState = {
  pedidos: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

/**
 * Pedidos Reducer
 * @param {Object} state - Current state
 * @param {Object} action - Action to dispatch
 * @returns {Object} New state
 */
export const pedidosReducer = (state, action) => {
  switch (action.type) {
    case PEDIDOS_ACTIONS.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case PEDIDOS_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        pedidos: action.payload,
        lastUpdated: new Date(),
        error: null,
      };

    case PEDIDOS_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case PEDIDOS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case PEDIDOS_ACTIONS.RESET_STATE:
      return initialPedidosState;

    default:
      return state || initialPedidosState;
  }
};
