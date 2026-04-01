import React, { useState } from 'react';
import {
  HeaderButton,
  UserInfo,
  ProfileIcon,
  UserEmail,
} from './Header';
import { Modal } from './Modal';
import { AnalyticsView } from './AnalyticsView';
import { DASHBOARD_LABELS, DASHBOARD_TOOLTIPS } from '../config/dashboardConfig';

/**
 * Header right cluster for authenticated app surfaces: optional architect analytics + user menu.
 */
export const AuthenticatedHeaderRight = ({
  role,
  onEditProfile,
  onLogout,
  email,
  iconSvg,
}) => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <>
      {role === 'architect' && (
        <HeaderButton
          onClick={() => setShowAnalytics(true)}
          title={DASHBOARD_TOOLTIPS.STATISTICS}
        >
          <span>{DASHBOARD_LABELS.HEADER_BUTTONS.STATISTICS}</span>
        </HeaderButton>
      )}
      <UserInfo
        onEditProfile={onEditProfile}
        onLogout={onLogout}
        email={email}
        iconSvg={iconSvg}
      >
        <ProfileIcon iconSvg={iconSvg} />
        <UserEmail email={email} />
      </UserInfo>
      <Modal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)}>
        <AnalyticsView onClose={() => setShowAnalytics(false)} />
      </Modal>
    </>
  );
};
