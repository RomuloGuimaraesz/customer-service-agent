import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal } from './Modal';
import { supabase } from '../infrastructure/supabase/config';

/**
 * Modal Header - BEM: profile-edit-modal__header
 */
const StyledModalHeader = styled.div`
  padding: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * Modal Title - BEM: profile-edit-modal__title
 */
const StyledModalTitle = styled.h2`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

/**
 * Close Button - BEM: profile-edit-modal__close-button
 */
const StyledCloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.fontSize['2xl']};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  line-height: 1;
  transition: color ${props => props.theme.transitions.fast} ease;

  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

/**
 * Modal Body - BEM: profile-edit-modal__body
 */
const StyledModalBody = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

/**
 * Form Group - BEM: profile-edit-modal__form-group
 */
const StyledFormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

/**
 * Label - BEM: profile-edit-modal__label
 */
const StyledLabel = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

/**
 * Input - BEM: profile-edit-modal__input
 */
const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.base};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};
  transition: border-color ${props => props.theme.transitions.fast} ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.status.info};
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
`;

/**
 * Profile Photo Section - BEM: profile-edit-modal__photo-section
 */
const StyledPhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

/**
 * Profile Photo Preview - BEM: profile-edit-modal__photo-preview
 */
const StyledPhotoPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  background-color: ${props => props.theme.colors.background.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid ${props => props.theme.colors.border.primary};
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    width: 60px;
    height: 60px;
    opacity: 0.5;
  }
`;

/**
 * File Input - BEM: profile-edit-modal__file-input
 */
const StyledFileInput = styled.input`
  display: none;
`;

/**
 * File Input Label - BEM: profile-edit-modal__file-label
 */
const StyledFileLabel = styled.label`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.fast} ease;

  &:hover {
    background-color: ${props => props.theme.colors.background.tertiary};
  }
`;

/**
 * Remove Photo Button - BEM: profile-edit-modal__remove-photo
 */
const StyledRemovePhotoButton = styled.button`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.status.errorText};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: ${props => props.theme.colors.status.error};
  }
`;

/**
 * Modal Footer - BEM: profile-edit-modal__footer
 */
const StyledModalFooter = styled.div`
  padding: ${props => props.theme.spacing.xl};
  border-top: 1px solid ${props => props.theme.colors.border.primary};
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
`;

/**
 * Button - BEM: profile-edit-modal__button
 */
const StyledButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast} ease;
  border: 1px solid transparent;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * Cancel Button - BEM: profile-edit-modal__cancel-button
 */
const StyledCancelButton = styled(StyledButton)`
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};
  border-color: ${props => props.theme.colors.border.primary};

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.background.tertiary};
  }
`;

/**
 * Save Button - BEM: profile-edit-modal__save-button
 */
const StyledSaveButton = styled(StyledButton)`
  background-color: ${props => props.theme.colors.button.primary};
  color: ${props => props.theme.colors.text.light};

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.button.primaryHover};
  }
`;

/**
 * Error Message - BEM: profile-edit-modal__error
 */
const StyledErrorMessage = styled.div`
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.status.errorBg};
  color: ${props => props.theme.colors.status.errorText};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSize.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

/**
 * Success Message - BEM: profile-edit-modal__success
 */
const StyledSuccessMessage = styled.div`
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.status.successBg};
  color: ${props => props.theme.colors.status.successText};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSize.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

/**
 * Loading Spinner - BEM: profile-edit-modal__loading
 */
const StyledLoading = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid ${props => props.theme.colors.border.primary};
  border-top-color: ${props => props.theme.colors.text.primary};
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-left: ${props => props.theme.spacing.sm};

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/**
 * ProfileEditModal Component
 * Modal for editing user profile (name and photo)
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal should close
 * @param {Function} [props.onSave] - Callback when profile is saved successfully
 */
export const ProfileEditModal = ({ isOpen, onClose, onSave }) => {
  const [fullName, setFullName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadUserData();
    } else {
      // Reset form when modal closes
      setFullName('');
      setProfilePhoto(null);
      setPhotoPreview(null);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        setFullName(user.user_metadata?.full_name || '');
        setPhotoPreview(user.user_metadata?.avatar_url || null);
      }
    } catch (err) {
      setError('Erro ao carregar dados do usuário');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione um arquivo de imagem');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        return;
      }

      setProfilePhoto(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let avatarUrl = currentUser?.user_metadata?.avatar_url || null;

      // Upload photo if a new one was selected
      if (profilePhoto) {
        try {
          const fileExt = profilePhoto.name.split('.').pop();
          const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, profilePhoto, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) {
            // If bucket doesn't exist or upload fails, show warning but continue
            console.warn('Storage upload error:', uploadError);
            // Note: In production, create the 'avatars' bucket in Supabase Storage
            // For now, we'll continue without photo upload
            setError('Aviso: Não foi possível fazer upload da foto. O perfil foi atualizado sem a foto.');
          } else {
            // Get public URL
            const { data } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);

            avatarUrl = data.publicUrl;
          }
        } catch (storageError) {
          // If storage fails, continue without photo
          console.warn('Photo upload failed, continuing without photo:', storageError);
          setError('Aviso: Não foi possível fazer upload da foto. O perfil foi atualizado sem a foto.');
        }
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName || null,
          avatar_url: avatarUrl,
        }
      });

      if (updateError) {
        throw new Error(updateError.message || 'Erro ao atualizar perfil');
      }

      setSuccess(true);
      
      // Call onSave callback if provided
      if (onSave) {
        onSave({
          fullName,
          avatarUrl,
        });
      }

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  const defaultAvatarSvg = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
      <path d="M12 14C7.58172 14 4 15.7909 4 18V20H20V18C20 15.7909 16.4183 14 12 14Z" fill="currentColor"/>
    </svg>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="500px">
      <StyledModalHeader className="profile-edit-modal__header">
        <StyledModalTitle className="profile-edit-modal__title">
          Editar Perfil
        </StyledModalTitle>
        <StyledCloseButton
          className="profile-edit-modal__close-button"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </StyledCloseButton>
      </StyledModalHeader>

      <StyledModalBody className="profile-edit-modal__body">
        {error && (
          <StyledErrorMessage className="profile-edit-modal__error">
            {error}
          </StyledErrorMessage>
        )}

        {success && (
          <StyledSuccessMessage className="profile-edit-modal__success">
            Perfil atualizado com sucesso!
          </StyledSuccessMessage>
        )}

        <StyledPhotoSection className="profile-edit-modal__photo-section">
          <StyledPhotoPreview className="profile-edit-modal__photo-preview">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" />
            ) : (
              defaultAvatarSvg
            )}
          </StyledPhotoPreview>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <StyledFileInput
              type="file"
              id="profile-photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="profile-edit-modal__file-input"
            />
            <StyledFileLabel htmlFor="profile-photo" className="profile-edit-modal__file-label">
              {photoPreview ? 'Alterar Foto' : 'Adicionar Foto'}
            </StyledFileLabel>
            {photoPreview && (
              <StyledRemovePhotoButton
                onClick={handleRemovePhoto}
                className="profile-edit-modal__remove-photo"
              >
                Remover Foto
              </StyledRemovePhotoButton>
            )}
          </div>
        </StyledPhotoSection>

        <StyledFormGroup className="profile-edit-modal__form-group">
          <StyledLabel htmlFor="full-name" className="profile-edit-modal__label">
            Nome Completo
          </StyledLabel>
          <StyledInput
            id="full-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Digite seu nome completo"
            className="profile-edit-modal__input"
            disabled={loading}
          />
        </StyledFormGroup>
      </StyledModalBody>

      <StyledModalFooter className="profile-edit-modal__footer">
        <StyledCancelButton
          onClick={onClose}
          disabled={loading}
          className="profile-edit-modal__cancel-button"
        >
          Cancelar
        </StyledCancelButton>
        <StyledSaveButton
          onClick={handleSave}
          disabled={loading}
          className="profile-edit-modal__save-button"
        >
          Salvar
          {loading && <StyledLoading className="profile-edit-modal__loading" />}
        </StyledSaveButton>
      </StyledModalFooter>
    </Modal>
  );
};

