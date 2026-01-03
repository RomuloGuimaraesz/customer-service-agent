/**
 * Agendamentos Reducer - Manages agendamentos state with useReducer
 * Provides predictable state updates for agendamentos-related operations
 */

// Action Types
export const AGENDAMENTOS_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE',
};

// Initial State
export const initialAgendamentosState = {
  agendamentos: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

/**
 * Agendamentos Reducer
 * @param {Object} state - Current state
 * @param {Object} action - Action to dispatch
 * @returns {Object} New state
 */
export const agendamentosReducer = (state, action) => {
  switch (action.type) {
    case AGENDAMENTOS_ACTIONS.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AGENDAMENTOS_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        agendamentos: action.payload,
        lastUpdated: new Date(),
        error: null,
      };

    case AGENDAMENTOS_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case AGENDAMENTOS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AGENDAMENTOS_ACTIONS.RESET_STATE:
      return initialAgendamentosState;

    default:
      return state || initialAgendamentosState;
  }
};
