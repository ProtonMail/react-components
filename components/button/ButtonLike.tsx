import React from 'react';

import Icon, { Props as IconProps } from '../icon/Icon';
import { classnames } from '../../helpers';
import { Box, PolymorphicComponentProps } from '../../helpers/react-polymorphic-box';

type Shape = 'solid' | 'outline' | 'ghost' | 'link';

type Color = 'norm' | 'weak' | 'danger' | 'warning' | 'success' | 'info';

type Size = 'small' | 'medium' | 'large';

type Side = 'left' | 'right';

interface ButtonLikeOwnProps {
    icon?: React.ReactNode;
    iconSide?: Side;
    /**
     * Props supplied to the Icon component.
     * The Icon component only renders if the "icon" prop is supplied.
     */
    iconProps?: IconProps;
    /**
     * Whether the button should render a loader.
     * Button is disabled when this prop is true.
     */
    loading?: boolean;
    shape?: Shape;
    /**
     * Controls the colors of the button.
     * Exact styles applied depend on the chosen shape as well.
     */
    color?: Color;
    /**
     * Controls how large the button should be.
     */
    size?: Size;
    /** Puts the button in a disabled state. */
    disabled?: boolean;
    /** If true, the button will take up the full width of its container. */
    fullWidth?: boolean;
    /** If true, reset all button classes */
    reset?: boolean;
}

export type ButtonLikeProps<E extends React.ElementType> = PolymorphicComponentProps<E, ButtonLikeOwnProps>;

const defaultElement = 'button';

export const ButtonLike: <E extends React.ElementType = typeof defaultElement>(
    props: ButtonLikeProps<E>
) => React.ReactElement | null = React.forwardRef(
    <E extends React.ElementType = typeof defaultElement>(
        {
            loading = false,
            disabled = false,
            className,
            tabIndex,
            icon,
            iconSide = 'left',
            iconProps,
            children,
            shape: shapeProp,
            color: colorProp,
            size: sizeProp,
            reset,
            fullWidth,
            ...restProps
        }: ButtonLikeProps<E>,
        ref: typeof restProps.ref
    ) => {
        const shape = shapeProp || 'solid';
        const color = colorProp || 'weak';
        const size = sizeProp || 'medium';
        const isDisabled = loading || disabled;

        const splitClassNames = ((className || '') as string).split(' ');

        const isUsingLegacyApi = splitClassNames.some((cn: string) => cn === 'button' || cn.match(/button--/));

        const iconComponent = icon && (
            <>
                {typeof icon === 'string' ? (
                    <Icon
                        name={icon}
                        {...iconProps}
                        className={classnames(['flex-item-noshrink', iconProps?.className])}
                    />
                ) : (
                    icon
                )}
            </>
        );

        const iconButtonClass = isUsingLegacyApi ? 'button--for-icon' : 'button-for-icon';

        const buttonBaseClassName = shape === 'link' ? 'button-link' : 'button-henlo';

        const getLegacyClassNames = () => {
            const legacyClassNames = [];
            if (color === 'norm') {
                legacyClassNames.push('button--primary');
            }
            if (color === 'danger') {
                legacyClassNames.push('button--error');
            }
            if (color === 'warning') {
                legacyClassNames.push('button--warning');
            }
            if (size === 'large') {
                legacyClassNames.push('button--large');
            }
            if (size === 'small') {
                legacyClassNames.push('button--small');
            }
            return legacyClassNames;
        };
        const legacyClassNames = isUsingLegacyApi ? getLegacyClassNames() : [];

        const buttonBaseClassNames = [
            isUsingLegacyApi ? 'button' : buttonBaseClassName,
            ...legacyClassNames,
            !isUsingLegacyApi && size !== 'medium' && `button-${size}`,
            !isUsingLegacyApi && `button-${shape}-${color}`,
            restProps.as !== 'button' ? 'inline-block text-center' : '',
        ];

        const buttonClassName = classnames([
            ...(!reset ? buttonBaseClassNames : []),
            fullWidth && 'w100',
            iconComponent ? iconButtonClass : '',
            className,
        ]);

        const roleProps = restProps.onClick ? { role: 'button' } : undefined;

        return (
            <Box
                as={defaultElement}
                ref={ref}
                className={buttonClassName}
                disabled={isDisabled}
                tabIndex={isDisabled ? -1 : tabIndex}
                aria-busy={loading}
                {...roleProps}
                {...restProps}
            >
                {iconSide === 'left' ? (
                    <>
                        {iconComponent}
                        {children}
                    </>
                ) : (
                    <>
                        {children}
                        {iconComponent}
                    </>
                )}
            </Box>
        );
    }
);

export default ButtonLike;
