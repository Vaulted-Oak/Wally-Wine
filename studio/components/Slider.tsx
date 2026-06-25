import React, {useCallback, useState} from 'react';
import {Flex, Box, Text, TextInput, Button} from '@sanity/ui';
import {ChevronUpIcon, ChevronDownIcon} from '@sanity/icons';
import {NumberInputProps, set, unset} from 'sanity';

interface SliderProps extends Omit<NumberInputProps, 'value' | 'onChange'> {
  value?: number;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value = 0,
  onChange,
  min = 0,
  max = 200,
  step = 1,
  suffix = 'px',
  ...props
}) => {
  const [inputValue, setInputValue] = useState(String(value || 0));
  const [hasError, setHasError] = useState(false);

  const handleSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(event.target.value, 10);
      if (isNaN(newValue)) {
        onChange(undefined);
      } else {
        onChange(newValue);
        setInputValue(String(newValue));
        setHasError(false);
      }
    },
    [onChange],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = event.target.value;
      setInputValue(inputVal);

      const numValue = parseInt(inputVal, 10);

      if (inputVal === '' || isNaN(numValue)) {
        setHasError(false);
        onChange(undefined);
        return;
      }

      if (numValue < min) {
        setHasError(true);
        return;
      }

      if (numValue > max) {
        setHasError(true);
        return;
      }

      setHasError(false);
      onChange(numValue);
    },
    [onChange, min, max],
  );

  const handleInputBlur = useCallback(() => {
    if (hasError || inputValue === '') {
      setInputValue(String(value || 0));
      setHasError(false);
    }
  }, [hasError, inputValue, value]);

  const handleIncrement = useCallback(() => {
    const currentValue = value || 0;
    const newValue = Math.min(max, currentValue + step);
    onChange(newValue);
    setInputValue(String(newValue));
    setHasError(false);
  }, [value, max, step, onChange]);

  const handleDecrement = useCallback(() => {
    const currentValue = value || 0;
    const newValue = Math.max(min, currentValue - step);
    onChange(newValue);
    setInputValue(String(newValue));
    setHasError(false);
  }, [value, min, step, onChange]);

  React.useEffect(() => {
    setInputValue(String(value || 0));
  }, [value]);

  return (
    <Box style={{padding: '8px 0'}}>
      <Flex align="center" gap={3}>
        <Box flex={1} style={{position: 'relative'}}>
          <style>
            {`
              .slider-track {
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 2px;
                transform: translateY(-50%);
                background: repeating-linear-gradient(
                  to right,
                  #555 0px,
                  #555 3px,
                  transparent 3px,
                  transparent 6px
                );
                opacity: 0.6;
              }

              .slider-progress {
                position: absolute;
                top: 50%;
                left: 0;
                height: 2px;
                transform: translateY(-50%);
                background: #8b5cf6;
                transition: width 0.15s ease;
                border-radius: 1px;
              }

              .slider {
                width: 100%;
                height: 20px;
                background: transparent;
                outline: none;
                border: none;
                cursor: pointer;
                -webkit-appearance: none;
                appearance: none;
                position: relative;
              }

              .slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #8b5cf6;
                cursor: pointer;
                border: none;
                box-shadow: 0 0 0 2px #8b5cf6;
                transition: all 0.2s ease;
              }

              .slider::-webkit-slider-thumb:hover {
                background: #a78bfa;
                box-shadow: 0 0 0 3px #a78bfa;
                transform: scale(1.1);
              }

              .slider::-webkit-slider-thumb:active {
                transform: scale(0.95);
              }

              .slider::-webkit-slider-track {
                height: 2px;
                background: transparent;
                border: none;
              }

              .slider::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #8b5cf6;
                cursor: pointer;
                border: none;
                box-shadow: 0 0 0 2px #8b5cf6;
              }

              .slider::-moz-range-track {
                height: 2px;
                background: transparent;
                border: none;
              }
            `}
          </style>
          <div className="slider-track" />
          <div
            className="slider-progress"
            style={{width: `${((value || 0) / max) * 100}%`}}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value || 0}
            onChange={handleSliderChange}
            className="slider"
          />
        </Box>
        <Box style={{display: 'flex', alignItems: 'stretch', height: '32px'}}>
          <div style={{position: 'relative', flex: 1}}>
            <TextInput
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              style={{
                width: '80px',
                textAlign: 'right',
                paddingRight: '24px',
                height: '32px',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
                backgroundColor: hasError ? '#fef2f2' : 'var(--card-bg-color)',
                border: hasError
                  ? '1px solid #dc2626'
                  : '1px solid var(--card-border-color)',
                borderRight: hasError
                  ? '1px solid #dc2626'
                  : '1px solid var(--card-border-color)',
                color: hasError ? '#dc2626' : 'var(--card-fg-color)',
              }}
              fontSize={1}
            />
            <Text
              size={1}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--card-muted-fg-color)',
              }}
            >
              {suffix}
            </Text>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: hasError
                ? '1px solid #dc2626'
                : '1px solid var(--card-border-color)',
              borderLeft: 'none',
              borderTopRightRadius: '3px',
              borderBottomRightRadius: '3px',
              backgroundColor: hasError ? '#fef2f2' : 'var(--card-bg-color)',
              overflow: 'hidden',
            }}
          >
            <Button
              mode="ghost"
              tone="default"
              icon={ChevronUpIcon}
              onClick={handleIncrement}
              disabled={(value || 0) >= max}
              style={{
                padding: '0',
                minHeight: '16px',
                minWidth: '24px',
                borderRadius: '0',
                borderTopRightRadius: '2px',
                border: 'none',
                backgroundColor: 'transparent',
                color: hasError ? '#dc2626' : 'var(--card-fg-color)',
                cursor: (value || 0) >= max ? 'not-allowed' : 'pointer',
                opacity: (value || 0) >= max ? 0.4 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if ((value || 0) < max) {
                  e.currentTarget.style.backgroundColor =
                    'var(--card-hover-bg-color)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              fontSize={0}
            />
            <Button
              mode="ghost"
              tone="default"
              icon={ChevronDownIcon}
              onClick={handleDecrement}
              disabled={(value || 0) <= min}
              style={{
                padding: '0',
                minHeight: '16px',
                minWidth: '24px',
                borderRadius: '0',
                borderBottomRightRadius: '2px',
                border: 'none',
                backgroundColor: 'transparent',
                color: hasError ? '#dc2626' : 'var(--card-fg-color)',
                cursor: (value || 0) <= min ? 'not-allowed' : 'pointer',
                opacity: (value || 0) <= min ? 0.4 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if ((value || 0) > min) {
                  e.currentTarget.style.backgroundColor =
                    'var(--card-hover-bg-color)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              fontSize={0}
            />
          </div>
          {hasError && (
            <Text
              size={0}
              style={{
                color: '#dc2626',
                marginTop: '4px',
                fontSize: '11px',
                display: 'block',
              }}
            >
              Must be between {min}-{max}
              {suffix}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

// Custom input component for Sanity
export const SliderInput = (
  props: NumberInputProps & {
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
  },
) => {
  const {value, onChange, min, max, step, suffix} = props;
  const numericValue =
    typeof value === 'number' ? value : parseInt(String(value || 0), 10) || 0;

  const handleChange = useCallback(
    (newValue: number | undefined) => {
      if (newValue === undefined) {
        onChange(unset());
      } else {
        onChange(set(newValue));
      }
    },
    [onChange],
  );

  return (
    <Slider
      {...props}
      value={numericValue}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      suffix={suffix}
    />
  );
};

// Helper function for creating slider inputs with proper typing
export const createSliderInput = (options: {
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) => {
  return (props: any) => (
    <SliderInput
      {...props}
      min={options.min}
      max={options.max}
      step={options.step}
      suffix={options.suffix}
    />
  );
};

// Backward compatibility export
export const PaddingSliderInput = SliderInput;
