import React, { ChangeEvent, KeyboardEvent, useRef, ReactNode } from 'react';
import { classnames } from '../../helpers';
import ButtonLike from './ButtonLike';

import './FileButton.scss';

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    className?: string;
    icon?: string;
    disabled?: boolean;
    onAddFiles: (files: File[]) => void;
    children?: ReactNode;
}

const FileButton = ({ onAddFiles, icon = 'attach', disabled, className, children, ...rest }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        if (input.files) {
            onAddFiles([...input.files]);
            input.value = '';
        }
    };
    const handleKey = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            inputRef.current?.click();
        }
    };

    return (
        <div className="file-button flex">
            <ButtonLike
                as="label"
                role="button"
                tabIndex={0}
                className={classnames([
                    'inline-flex relative flex-align-items-center',
                    disabled && 'is-disabled',
                    className,
                ])}
                onKeyDown={handleKey}
                icon={icon}
            >
                {children}
                <input ref={inputRef} type="file" multiple onChange={handleChange} {...rest} />
            </ButtonLike>
        </div>
    );
};

export default FileButton;
