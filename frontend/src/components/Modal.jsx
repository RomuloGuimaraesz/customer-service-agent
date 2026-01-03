import React from 'react';
import styled from 'styled-components';

/**
 * Modal Overlay - BEM: modal__overlay
 */
const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${props => props.theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  overflow: auto;
`;

/**
 * Modal Content - BEM: modal__content
 */
const StyledModalContent = styled.div`
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  max-width: ${props => props.maxWidth || '1200px'};
  width: 100%;
  max-height: ${props => props.maxHeight || '90vh'};
  overflow: auto;
  box-shadow: ${props => props.theme.shadows.lg};
`;

/**
 * Modal Component
 * Reusable modal component with overlay and content container
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal should close (clicking overlay or ESC key)
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} [props.maxWidth] - Maximum width of modal content (default: '1200px')
 * @param {string} [props.maxHeight] - Maximum height of modal content (default: '90vh')
 */
export const Modal = ({ isOpen, onClose, children, maxWidth, maxHeight }) => {
  // Handle ESC key press
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <StyledModalOverlay
      className="modal__overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <StyledModalContent
        className="modal__content"
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </StyledModalContent>
    </StyledModalOverlay>
  );
};

