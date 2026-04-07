/**
 * Atendimentos Reducer - Manages atendimentos state with useReducer
 * Provides predictable state updates for atendimentos-related operations
 */

// Action Types
export const ATENDIMENTOS_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE',
};

// Initial State
export const initialAtendimentosState = {
  atendimentos: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

/**
 * Atendimentos Reducer
 * @param {Object} state - Current state
 * @param {Object} action - Action to dispatch
 * @returns {Object} New state
 */
export const atendimentosReducer = (state, action) => {
  switch (action.type) {
    case ATENDIMENTOS_ACTIONS.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ATENDIMENTOS_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        atendimentos: action.payload,
        lastUpdated: new Date(),
        error: action.preserveError ? state.error : null,
      };

    case ATENDIMENTOS_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ATENDIMENTOS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ATENDIMENTOS_ACTIONS.RESET_STATE:
      return initialAtendimentosState;

    default:
      return state || initialAtendimentosState;
  }
};
