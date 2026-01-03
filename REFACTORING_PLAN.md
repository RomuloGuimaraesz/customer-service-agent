# Refactoring Plan for AdminContext.jsx

## Executive Summary

This document outlines a comprehensive refactoring plan for `AdminContext.jsx` to address code smells, improve maintainability, and align with the existing Clean Architecture pattern used in the codebase.

## Current Issues Identified

### 1. Code Duplication
- **Duplicate Mock Conversations**: Defined twice (lines 95-120 and 151-176)
- **Duplicate Mock Messages**: Defined twice (lines 211-233 and 302-324)
- **Repeated Conversation Lookup Pattern**: `(conv.id || conv.phone) === conversationId` appears multiple times
- **Repeated Demo Mode Check**: `const isDemoMode = !authHeader;` repeated in multiple functions
- **Repeated API Fetch Patterns**: Similar fetch logic duplicated across functions

### 2. God Component / Too Many Responsibilities
The context handles:
- Pedidos management
- Agendamentos management
- Conversations management
- Messages management
- Analytics tracking
- Loading/error state management
- API communication
- Demo mode fallbacks

### 3. Complex and Fragile State Management
- **State Synchronization Issues**: Messages stored in two places (`selectedConversation.messages` and `conversations[].messages`)
- **setTimeout Hack**: Used to work around state update timing issues (line 467)
- **Nested State Updates**: Complex nested `setState` calls in `selectConversation`
- **Missing Dependencies**: `selectConversation` uses `conversations` but doesn't include it in dependency array

### 4. Inconsistent Error Handling
- Different error messages for similar scenarios
- Missing 401 checks in some functions

### 5. Magic Strings
- State keys like `'pedidos'`, `'agendamentos'`, `'conversations'`, `'messages'` used as strings throughout

### 6. Architecture Mismatch
- Doesn't follow Clean Architecture pattern (no use cases, no repositories)
- Direct API calls mixed with business logic
- Inconsistent with `AuthContext` which uses use cases and repositories

---

## Refactoring Plan

### Phase 1: Extract and Consolidate Duplicated Code

#### 1.1 Create Mock Data Constants
- **File**: `frontend/src/data/mockData.js` (extend existing)
- **Action**: Extract duplicate mock conversations and messages
- **Benefits**: Single source of truth for mock data, easier to maintain

#### 1.2 Create API Service Layer
- **File**: `frontend/src/services/apiService.js`
- **Responsibilities**:
  - Centralize fetch logic
  - Common headers builder
  - Error handling
  - Demo mode detection
  - Response parsing
- **Benefits**: DRY principle, consistent error handling

#### 1.3 Create Helper Utilities
- **File**: `frontend/src/utils/conversationHelpers.js`
- **Functions**:
  - `findConversationById(id, conversations)`
  - `normalizeConversationId(conversation)`
  - `isDemoMode(authHeader)`
- **Benefits**: Reusable utilities, consistent logic

---

### Phase 2: Implement Clean Architecture Pattern

#### 2.1 Create Domain Entities
- **Files**:
  - `frontend/src/domain/entities/Pedido.js`
  - `frontend/src/domain/entities/Agendamento.js`
  - `frontend/src/domain/entities/Conversation.js`
  - `frontend/src/domain/entities/Message.js`
- **Purpose**: Represent business objects with validation and behavior

#### 2.2 Create Repository Interfaces
- **Files**:
  - `frontend/src/domain/repositores/PedidoRepository.js`
  - `frontend/src/domain/repositores/AgendamentoRepository.js`
  - `frontend/src/domain/repositores/ConversationRepository.js`
- **Purpose**: Define contracts for data access (following existing pattern)

#### 2.3 Create Repository Implementations
- **Files**:
  - `frontend/src/infrastructure/api/PedidoApiRepository.js`
  - `frontend/src/infrastructure/api/AgendamentoApiRepository.js`
  - `frontend/src/infrastructure/api/ConversationApiRepository.js`
  - `frontend/src/infrastructure/mock/MockRepository.js` (for demo mode)
- **Purpose**: Concrete implementations for API and mock data

#### 2.4 Create Use Cases
- **Files**:
  - `frontend/src/domain/useCases/FetchPedidos.js`
  - `frontend/src/domain/useCases/FetchAgendamentos.js`
  - `frontend/src/domain/useCases/FetchConversations.js`
  - `frontend/src/domain/useCases/FetchMessages.js`
  - `frontend/src/domain/useCases/SendMessage.js`
- **Purpose**: Encapsulate business logic (following existing pattern like `Login.js`)

---

### Phase 3: Split AdminContext into Focused Contexts

#### 3.1 Create PedidosContext
- **File**: `frontend/src/contexts/PedidosContext.jsx`
- **Responsibilities**:
  - Pedidos state management
  - Loading/error states for pedidos
  - Uses `FetchPedidos` use case
- **Benefits**: Single responsibility, easier to test

#### 3.2 Create AgendamentosContext
- **File**: `frontend/src/contexts/AgendamentosContext.jsx`
- **Responsibilities**:
  - Agendamentos state management
  - Loading/error states for agendamentos
  - Uses `FetchAgendamentos` use case
- **Benefits**: Single responsibility, easier to test

#### 3.3 Create ConversationsContext
- **File**: `frontend/src/contexts/ConversationsContext.jsx`
- **Responsibilities**:
  - Conversations state management
  - Messages state management
  - Selected conversation state
  - Uses conversation-related use cases
- **Benefits**: Single responsibility, easier to test

#### 3.4 Create AdminContext (Orchestrator)
- **File**: `frontend/src/contexts/AdminContext.jsx` (refactored)
- **Responsibilities**:
  - Composes sub-contexts
  - Manages `activeTab` state
  - Handles analytics tracking
  - Provides unified interface for backward compatibility
- **Benefits**: Maintains backward compatibility while improving internal structure

---

### Phase 4: Simplify State Management

#### 4.1 Use useReducer for Complex State
- Replace nested `useState` objects with `useReducer`
- Create reducers:
  - `pedidosReducer.js`
  - `agendamentosReducer.js`
  - `conversationsReducer.js`
- **Benefits**: More predictable state updates, easier to debug

#### 4.2 Fix Message State Synchronization
- **Single Source of Truth**: Store messages only in `conversations[].messages`
- `selectedConversation` should reference the conversation from the list
- Remove duplicate message storage
- **Benefits**: Eliminates sync issues, simpler state model

#### 4.3 Remove setTimeout Hack
- Use proper state update patterns
- Consider using `useEffect` for dependent state updates
- Use functional state updates consistently
- **Benefits**: More predictable behavior, easier to reason about

---

### Phase 5: Extract Analytics to Hook

#### 5.1 Create useTabAnalytics Hook
- **File**: `frontend/src/hooks/useTabAnalytics.js`
- **Action**: Move analytics logic from AdminContext
- **Responsibilities**: Handles tab session tracking
- **Benefits**: Separation of concerns, reusable hook

---

### Phase 6: Create Custom Hooks for Data Fetching

#### 6.1 Create Data Fetching Hooks
- **Files**:
  - `frontend/src/hooks/usePedidos.js`
  - `frontend/src/hooks/useAgendamentos.js`
  - `frontend/src/hooks/useConversations.js`
- **Responsibilities**:
  - Encapsulate fetching logic
  - Handle loading/error states
  - Support demo mode
- **Benefits**: Reusable logic, cleaner components

---

## Detailed Implementation Steps

### Step 1: Create Infrastructure (No Breaking Changes)
```
1. Create apiService.js
2. Create conversationHelpers.js
3. Extend mockData.js with conversation/message mocks
4. Test utilities independently
```

### Step 2: Create Domain Layer
```
1. Create entity classes
2. Create repository interfaces
3. Create repository implementations (API + Mock)
4. Create use cases
5. Write unit tests for use cases
```

### Step 3: Create New Contexts (Parallel to Existing)
```
1. Create PedidosContext
2. Create AgendamentosContext
3. Create ConversationsContext
4. Create useTabAnalytics hook
5. Test new contexts independently
```

### Step 4: Refactor AdminContext (Maintain Compatibility)
```
1. Refactor AdminContext to use new contexts
2. Maintain same public API (value object)
3. Update internal implementation
4. Test backward compatibility
```

### Step 5: Update Components (Gradual Migration)
```
1. Update components to use specific contexts where possible
2. Keep AdminContext for backward compatibility
3. Gradually migrate to direct context usage
```

### Step 6: Cleanup
```
1. Remove duplicate code
2. Remove setTimeout hacks
3. Fix all dependency arrays
4. Update tests
5. Remove deprecated code
```

---

## File Structure After Refactoring

```
frontend/src/
├── contexts/
│   ├── AdminContext.jsx          # Orchestrator (refactored)
│   ├── PedidosContext.jsx         # NEW
│   ├── AgendamentosContext.jsx    # NEW
│   └── ConversationsContext.jsx   # NEW
├── domain/
│   ├── entities/
│   │   ├── Pedido.js              # NEW
│   │   ├── Agendamento.js         # NEW
│   │   ├── Conversation.js        # NEW
│   │   └── Message.js             # NEW
│   ├── repositores/
│   │   ├── PedidoRepository.js    # NEW
│   │   ├── AgendamentoRepository.js # NEW
│   │   └── ConversationRepository.js # NEW
│   └── useCases/
│       ├── FetchPedidos.js        # NEW
│       ├── FetchAgendamentos.js  # NEW
│       ├── FetchConversations.js  # NEW
│       ├── FetchMessages.js      # NEW
│       └── SendMessage.js         # NEW
├── infrastructure/
│   ├── api/
│   │   ├── PedidoApiRepository.js    # NEW
│   │   ├── AgendamentoApiRepository.js # NEW
│   │   └── ConversationApiRepository.js # NEW
│   └── mock/
│       └── MockRepository.js      # NEW
├── services/
│   ├── apiService.js              # NEW
│   └── analytics.js               # Existing
├── hooks/
│   ├── useTabAnalytics.js         # NEW
│   ├── usePedidos.js              # NEW (optional)
│   ├── useAgendamentos.js         # NEW (optional)
│   └── useConversations.js        # NEW (optional)
├── utils/
│   └── conversationHelpers.js     # NEW
└── data/
    └── mockData.js                # Extended
```

---

## Benefits of Refactoring

1. **Architectural Consistency**: Aligns with Clean Architecture pattern used in AuthContext
2. **Code Reusability**: Eliminates duplication, creates reusable utilities
3. **Testability**: Use cases and repositories can be unit tested independently
4. **Maintainability**: Clear separation of concerns, easier to modify
5. **Scalability**: Easy to add new features or data types
6. **Backward Compatibility**: Existing components continue to work during migration
7. **Demo Mode Support**: Clean separation between real and mock data
8. **State Management**: Simpler, more predictable state updates

---

## Migration Strategy

### Approach: Incremental Migration
1. **Phase 1-2**: Build new infrastructure alongside existing code (no breaking changes)
2. **Phase 3**: Create new contexts, test in parallel with existing AdminContext
3. **Phase 4**: Refactor AdminContext to use new contexts (maintains public API)
4. **Phase 5-6**: Gradual component migration (components can use either approach)
5. **Final**: Remove old code after full migration is complete

### Risk Mitigation
- Each phase can be tested independently
- Backward compatibility maintained throughout
- Rollback possible at any phase
- No big-bang rewrite

---

## Testing Strategy

### Unit Tests
- Use cases (business logic)
- Repositories (data access)
- Utilities and helpers
- Entity validation

### Integration Tests
- Context providers
- Hook behavior
- State management flows

### E2E Tests
- Critical user flows
- Data fetching scenarios
- Demo mode functionality

### Backward Compatibility Tests
- Ensure existing components still work
- Verify public API remains unchanged
- Test migration paths

---

## Success Criteria

- [ ] All code duplication eliminated
- [ ] Clean Architecture pattern implemented
- [ ] All tests passing
- [ ] No setTimeout hacks
- [ ] Single source of truth for state
- [ ] Backward compatibility maintained
- [ ] Demo mode works correctly
- [ ] Code coverage > 80%
- [ ] All dependency arrays correct
- [ ] No magic strings
- [ ] Consistent error handling

---

## Timeline Estimate

- **Phase 1**: 2-3 days (infrastructure setup)
- **Phase 2**: 3-4 days (domain layer)
- **Phase 3**: 2-3 days (new contexts)
- **Phase 4**: 2-3 days (AdminContext refactor)
- **Phase 5-6**: 2-3 days (hooks and cleanup)
- **Testing**: 2-3 days (throughout all phases)
- **Total**: ~2-3 weeks

---

## Notes

- This refactoring maintains backward compatibility with existing components
- Each phase can be done incrementally
- Testing should be done at each phase
- Consider code review after each major phase
- Document any deviations from this plan

---

## References

- Existing Clean Architecture implementation: `AuthContext.jsx`, `Login.js`, `UserRepository.js`
- Current AdminContext: `frontend/src/contexts/AdminContext.jsx`
- Mock data: `frontend/src/data/mockData.js`
- Analytics service: `frontend/src/services/analytics.js`

