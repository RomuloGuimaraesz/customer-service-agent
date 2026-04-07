import { describe, it, expect } from 'vitest';
import { pedidosReducer, initialPedidosState, PEDIDOS_ACTIONS } from './pedidosReducer';

describe('pedidosReducer', () => {
  it('should return initial state', () => {
    expect(pedidosReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialPedidosState);
  });

  it('should handle FETCH_START', () => {
    const result = pedidosReducer(initialPedidosState, { type: PEDIDOS_ACTIONS.FETCH_START });

    expect(result.loading).toBe(true);
    expect(result.error).toBe(null);
    expect(result.pedidos).toEqual([]);
  });

  it('should handle FETCH_SUCCESS', () => {
    const mockPedidos = [{ ID: 'BW-09022026-1000', Status: 'Em andamento', Nome: 'Bruce Wayne' }];
    const result = pedidosReducer(
      { ...initialPedidosState, loading: true },
      { type: PEDIDOS_ACTIONS.FETCH_SUCCESS, payload: mockPedidos }
    );

    expect(result.loading).toBe(false);
    expect(result.pedidos).toEqual(mockPedidos);
    expect(result.error).toBe(null);
    expect(result.lastUpdated).toBeInstanceOf(Date);
  });

  it('should handle FETCH_ERROR', () => {
    const errorMessage = 'Failed to fetch pedidos';
    const result = pedidosReducer(
      { ...initialPedidosState, loading: true },
      { type: PEDIDOS_ACTIONS.FETCH_ERROR, payload: errorMessage }
    );

    expect(result.loading).toBe(false);
    expect(result.error).toBe(errorMessage);
    expect(result.pedidos).toEqual([]);
  });

  it('should handle CLEAR_ERROR', () => {
    const stateWithError = { ...initialPedidosState, error: 'Some error' };
    const result = pedidosReducer(stateWithError, { type: PEDIDOS_ACTIONS.CLEAR_ERROR });

    expect(result.error).toBe(null);
  });

  it('should handle RESET_STATE', () => {
    const modifiedState = {
      pedidos: [{ ID: 'BW-09022026-1000', Nome: 'Bruce Wayne' }],
      loading: true,
      error: 'error',
      lastUpdated: new Date(),
    };
    const result = pedidosReducer(modifiedState, { type: PEDIDOS_ACTIONS.RESET_STATE });

    expect(result).toEqual(initialPedidosState);
  });
});


















