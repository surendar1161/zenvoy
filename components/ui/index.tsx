/**
 * DealPilot UI Component Library
 * 
 * Reusable, standardized components using design tokens
 * 
 * Usage:
 * import { StandardCard, StandardButton, ProgressCard } from '@/components/ui';
 */

import React from 'react';
import { Card, Button, Progress, Tag, Avatar, Typography, Space } from 'antd';
import { DESIGN_TOKENS, border, shadow } from '@/lib/design-tokens';
import type { CardProps, ButtonProps, ProgressProps, TagProps, AvatarProps } from 'antd';

const { Text } = Typography;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STANDARD CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface StandardCardProps extends CardProps {
  padding?: 'small' | 'medium' | 'large';
  radius?: 'small' | 'medium' | 'large';
}

export function StandardCard({
  padding = 'medium',
  radius = 'medium',
  style,
  styles,
  children,
  ...props
}: StandardCardProps) {
  const cardPadding = DESIGN_TOKENS.components.card.padding[padding];
  const cardRadius = DESIGN_TOKENS.components.card.borderRadius[radius];

  return (
    <Card
      style={{
        borderRadius: cardRadius,
        border: DESIGN_TOKENS.components.card.border,
        ...style,
      }}
      styles={{
        body: { padding: cardPadding },
        ...styles,
      }}
      {...props}
    >
      {children}
    </Card>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STANDARD BUTTON
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface StandardButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'small' | 'medium' | 'large' | 'xlarge';
}

export function StandardButton({
  variant = 'medium',
  style,
  ...props
}: StandardButtonProps) {
  const height = DESIGN_TOKENS.components.button.height[variant];
  const borderRadius = DESIGN_TOKENS.components.button.borderRadius[variant];
  const fontSize = DESIGN_TOKENS.components.button.fontSize[variant];

  return (
    <Button
      style={{
        height,
        borderRadius,
        fontSize,
        fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
        ...style,
      }}
      {...props}
    />
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROGRESS CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ProgressCardProps {
  current: number;
  total: number;
  label?: string;
  savedText?: string;
  showSavedIndicator?: boolean;
  icon?: React.ReactNode;
  gradient?: { from: string; to: string };
  style?: React.CSSProperties;
}

export function ProgressCard({
  current,
  total,
  label,
  savedText,
  showSavedIndicator = false,
  icon = '📝',
  gradient = { from: '#0ea5e9', to: '#10b981' },
  style,
}: ProgressCardProps) {
  const percent = (current / total) * 100;
  const isComplete = current === total;

  return (
    <StandardCard
      padding="small"
      radius="small"
      style={{
        marginBottom: DESIGN_TOKENS.spacing.lg,
        background: 'linear-gradient(135deg, #eff6ff 0%, #fff 100%)',
        ...style,
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Text strong style={{ fontSize: DESIGN_TOKENS.typography.fontSize.sm }}>
              {isComplete ? '✅ Ready!' : `${icon} ${current} of ${total} ${label || 'fields'}`}
            </Text>
            {showSavedIndicator && (
              <Tag color="blue" style={{ fontSize: DESIGN_TOKENS.typography.fontSize.xs }}>
                Saving...
              </Tag>
            )}
            {savedText && !showSavedIndicator && (
              <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.typography.fontSize.xs }}>
                {savedText}
              </Text>
            )}
          </Space>
          {isComplete && <span style={{ color: DESIGN_TOKENS.colors.success, fontSize: 18 }}>✓</span>}
        </div>
        <Progress
          percent={percent}
          showInfo={false}
          strokeColor={{
            '0%': gradient.from,
            '100%': gradient.to,
          }}
          trailColor={DESIGN_TOKENS.colors.gray[200]}
          strokeWidth={8}
          style={{ marginBottom: 0 }}
        />
      </Space>
    </StandardCard>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STANDARD TAG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface StandardTagProps extends Omit<TagProps, 'variant'> {
  variant?: 'small' | 'medium' | 'large';
}

export function StandardTag({
  variant = 'medium',
  style,
  ...props
}: StandardTagProps) {
  const height = DESIGN_TOKENS.components.tag.height[variant];
  const padding = DESIGN_TOKENS.components.tag.padding[variant];
  const fontSize = DESIGN_TOKENS.components.tag.fontSize[variant];
  const borderRadius = DESIGN_TOKENS.components.tag.borderRadius[variant];

  return (
    <Tag
      style={{
        height,
        padding,
        fontSize,
        borderRadius,
        lineHeight: `${height}px`,
        border: 'none',
        ...style,
      }}
      {...props}
    />
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATUS BADGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info' | 'default';
  label: string;
  size?: 'small' | 'medium' | 'large';
}

export function StatusBadge({ status, label, size = 'medium' }: StatusBadgeProps) {
  const colorMap = {
    success: { bg: DESIGN_TOKENS.colors.successPale, color: DESIGN_TOKENS.colors.successDark },
    warning: { bg: DESIGN_TOKENS.colors.warningPale, color: DESIGN_TOKENS.colors.warningDark },
    danger: { bg: DESIGN_TOKENS.colors.dangerPale, color: DESIGN_TOKENS.colors.dangerDark },
    info: { bg: DESIGN_TOKENS.colors.infoPale, color: DESIGN_TOKENS.colors.infoDark },
    default: { bg: DESIGN_TOKENS.colors.gray[100], color: DESIGN_TOKENS.colors.gray[700] },
  };

  const { bg, color } = colorMap[status];

  return (
    <StandardTag
      variant={size}
      style={{
        background: bg,
        color,
        fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
      }}
    >
      {label}
    </StandardTag>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INFO BANNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface InfoBannerProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
  style?: React.CSSProperties;
}

export function InfoBanner({
  icon,
  title,
  description,
  type = 'info',
  style,
}: InfoBannerProps) {
  const colorMap = {
    info: { bg: DESIGN_TOKENS.colors.infoPale, border: DESIGN_TOKENS.colors.info, text: DESIGN_TOKENS.colors.infoDark },
    success: { bg: DESIGN_TOKENS.colors.successPale, border: DESIGN_TOKENS.colors.success, text: DESIGN_TOKENS.colors.successDark },
    warning: { bg: DESIGN_TOKENS.colors.warningPale, border: DESIGN_TOKENS.colors.warning, text: DESIGN_TOKENS.colors.warningDark },
    danger: { bg: DESIGN_TOKENS.colors.dangerPale, border: DESIGN_TOKENS.colors.danger, text: DESIGN_TOKENS.colors.dangerDark },
  };

  const { bg, border: borderColor, text } = colorMap[type];

  return (
    <div
      style={{
        background: bg,
        border: border('thin', borderColor),
        borderRadius: DESIGN_TOKENS.borderRadius.md,
        padding: `${DESIGN_TOKENS.spacing.md}px ${DESIGN_TOKENS.spacing.lg}px`,
        marginBottom: DESIGN_TOKENS.spacing.lg,
        ...style,
      }}
    >
      <Space align="start" size={12}>
        {icon && <div style={{ fontSize: 18 }}>{icon}</div>}
        <div>
          <Text strong style={{ display: 'block', color: text, marginBottom: 4 }}>
            {title}
          </Text>
          <Text style={{ color: text, fontSize: DESIGN_TOKENS.typography.fontSize.sm }}>
            {description}
          </Text>
        </div>
      </Space>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STAT CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
  style?: React.CSSProperties;
}

export function StatCard({
  icon,
  label,
  value,
  subtext,
  color = DESIGN_TOKENS.colors.primary,
  style,
}: StatCardProps) {
  return (
    <StandardCard
      padding="medium"
      radius="medium"
      style={{
        textAlign: 'center',
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: DESIGN_TOKENS.borderRadius.md,
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: 24,
          }}
        >
          {icon}
        </div>
      )}
      <Text type="secondary" style={{ display: 'block', fontSize: DESIGN_TOKENS.typography.fontSize.sm, marginBottom: 4 }}>
        {label}
      </Text>
      <div style={{ fontSize: DESIGN_TOKENS.typography.fontSize.xxxl, fontWeight: DESIGN_TOKENS.typography.fontWeight.bold, color }}>
        {value}
      </div>
      {subtext && (
        <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.typography.fontSize.xs, display: 'block', marginTop: 4 }}>
          {subtext}
        </Text>
      )}
    </StandardCard>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EMPTY STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  style?: React.CSSProperties;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  style,
}: EmptyStateProps) {
  return (
    <StandardCard
      padding="large"
      radius="medium"
      style={{
        textAlign: 'center',
        ...style,
      }}
    >
      {icon && (
        <div style={{ fontSize: 64, color: DESIGN_TOKENS.colors.gray[300], marginBottom: DESIGN_TOKENS.spacing.md }}>
          {icon}
        </div>
      )}
      <Text strong style={{ display: 'block', fontSize: DESIGN_TOKENS.typography.fontSize.lg, marginBottom: DESIGN_TOKENS.spacing.sm }}>
        {title}
      </Text>
      {description && (
        <Text type="secondary" style={{ display: 'block', marginBottom: DESIGN_TOKENS.spacing.lg }}>
          {description}
        </Text>
      )}
      {action && (
        <StandardButton
          type="primary"
          variant="medium"
          icon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </StandardButton>
      )}
    </StandardCard>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION HEADER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

export function SectionHeader({
  icon,
  title,
  subtitle,
  action,
  style,
}: SectionHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: DESIGN_TOKENS.spacing.xl,
        ...style,
      }}
    >
      <div>
        <Space align="center" size={DESIGN_TOKENS.spacing.sm}>
          {icon && <div style={{ fontSize: 28, color: DESIGN_TOKENS.colors.primary }}>{icon}</div>}
          <Typography.Title
            level={2}
            style={{
              margin: 0,
              fontWeight: DESIGN_TOKENS.typography.fontWeight.extrabold,
            }}
          >
            {title}
          </Typography.Title>
        </Space>
        {subtitle && (
          <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.typography.fontSize.md, marginTop: 4, display: 'block' }}>
            {subtitle}
          </Text>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export {
  DESIGN_TOKENS,
  border,
  shadow,
} from '@/lib/design-tokens';
