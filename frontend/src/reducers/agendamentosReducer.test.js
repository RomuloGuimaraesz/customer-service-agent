import { describe, it, expect } from 'vitest';
import { agendamentosReducer, initialAgendamentosState, AGENDAMENTOS_ACTIONS } from './agendamentosReducer';

describe('agendamentosReducer', () => {
  it('should return initial state', () => {
    expect(agendamentosReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialAgendamentosState);
  });

  it('should handle FETCH_START', () => {
    const result = agendamentosReducer(initialAgendamentosState, { type: AGENDAMENTOS_ACTIONS.FETCH_START });

    expect(result.loading).toBe(true);
    expect(result.error).toBe(null);
    expect(result.agendamentos).toEqual([]);
  });

  it('should handle FETCH_SUCCESS', () => {
    const mockAgendamentos = [{ id: 1, name: 'Agendamento 1' }];
    const result = agendamentosReducer(
      { ...initialAgendamentosState, loading: true },
      { type: AGENDAMENTOS_ACTIONS.FETCH_SUCCESS, payload: mockAgendamentos }
    );

    expect(result.loading).toBe(false);
    expect(result.agendamentos).toEqual(mockAgendamentos);
    expect(result.error).toBe(null);
    expect(result.lastUpdated).toBeInstanceOf(Date);
  });

  it('should handle FETCH_ERROR', () => {
    const errorMessage = 'Failed to fetch agendamentos';
    const result = agendamentosReducer(
      { ...initialAgendamentosState, loading: true },
      { type: AGENDAMENTOS_ACTIONS.FETCH_ERROR, payload: errorMessage }
    );

    expect(result.loading).toBe(false);
    expect(result.error).toBe(errorMessage);
    expect(result.agendamentos).toEqual([]);
  });

  it('should handle CLEAR_ERROR', () => {
    const stateWithError = { ...initialAgendamentosState, error: 'Some error' };
    const result = agendamentosReducer(stateWithError, { type: AGENDAMENTOS_ACTIONS.CLEAR_ERROR });

    expect(result.error).toBe(null);
  });

  it('should handle RESET_STATE', () => {
    const modifiedState = {
      agendamentos: [{ id: 1 }],
      loading: true,
      error: 'error',
      lastUpdated: new Date(),
    };
    const result = agendamentosReducer(modifiedState, { type: AGENDAMENTOS_ACTIONS.RESET_STATE });

    expect(result).toEqual(initialAgendamentosState);
  });
});

















