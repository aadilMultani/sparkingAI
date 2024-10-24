import './Otpinput.css';
import React, { useRef } from 'react';

export type Props = {
    value: string;
    valueLength: number;
    onChange: (value: string) => void;
};

export default function OtpInput({ value, valueLength, onChange }: Props) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
        const inputValue = e.currentTarget.value;
        if (inputValue.length === 1) {
            if (index < valueLength - 1) {
                inputRefs.current?.[index + 1]?.focus();
            }
        }
        const newValue = [...value];
        newValue[index] = inputValue;
        onChange(newValue.join(""));
    };

    return (
        <div className="otp-group">
            {[...Array(valueLength)].map((_, idx) => (
                <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{1}"
                    maxLength={1}
                    className="otp-input"
                    value={value[idx] || ""}
                    onInput={(e) => handleInput(e, idx)}
                    ref={(ref) => {
                        if (!inputRefs.current) {
                            inputRefs.current = [];
                        }
                        inputRefs.current[idx] = ref;
                    }}
                />
            ))}
        </div>
    );
}