import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactElement,
} from 'react';
import ReactDatePicker from 'react-datepicker';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import 'react-datepicker/dist/react-datepicker.css';

interface CustomInputProps extends ComponentPropsWithoutRef<'input'> {
  /**
   * Кастомный инпут, чтобы не конфликтовало с Chakra `Input.size`
   */
  label?: string;
  htmlSize?: number;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
    ({ value, onClick, placeholder, label, htmlSize, size: _, ...rest }, ref) => (
      <FormControl>
        {label && <FormLabel>{label}</FormLabel>}
        <Input
          ref={ref}
          value={value}
          onClick={onClick}
          placeholder={placeholder}
          htmlSize={htmlSize}
          size="md"
          {...rest}
        />
      </FormControl>
    )
  );

interface CommonDatePickerProps {
  label?: string;
  customInput?: ReactElement;
  placeholderText?: string;
  minDate?: Date;
  maxDate?: Date;
  dayClassName?: (date: Date) => string;
  weekDayClassName?: (date: Date) => string;
  monthClassName?: (date: Date) => string;
  timeClassName?: (date: Date) => string;
  renderCustomHeader?: (props: any) => ReactElement;
  renderDayContents?: (day: number, date: Date) => ReactElement;
  renderMonthContent?: (
    month: number,
    shortMonth: string,
    fullMonth: string,
    day: Date
  ) => ReactElement;
  renderQuarterContent?: (quarter: number) => ReactElement;
  renderYearContent?: (year: number) => ReactElement;
  wrapperClassName?: string;
  showTimeSelect?: boolean;
  showMonthDropdown?: boolean;
  showYearDropdown?: boolean;
  dropdownMode?: 'scroll' | 'select';
  withPortal?: boolean;
  inline?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  dateFormat?: string;
  timeFormat?: string;
  timeIntervals?: number;
  filterDate?: (date: Date) => boolean;
  filterTime?: (date: Date) => boolean;
  calendarClassName?: string;
  popperClassName?: string;
  className?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onCalendarOpen?: () => void;
  onCalendarClose?: () => void;
}

export interface DatePickerSingleProps extends CommonDatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
}

export const DatePickerSingle = ({
  selectedDate,
  onChange,
  label,
  customInput,
  placeholderText,
  wrapperClassName,
  dayClassName,
  weekDayClassName,
  monthClassName,
  timeClassName,
  renderCustomHeader,
  renderDayContents,
  renderMonthContent,
  renderQuarterContent,
  renderYearContent,
  ...props
}: DatePickerSingleProps) => {
  const inputEl =
    customInput ?? (
      <CustomInput
        label={label}
        placeholder={placeholderText ?? 'Select date'}
      />
    );

  const wrapStr = (fn?: (d: Date) => string) =>
    fn ? (d: Date) => fn(d) : undefined;

  return (
    <Box className={`chakra-datepicker ${wrapperClassName ?? ''}`} w="100%">
      <ReactDatePicker
        selected={selectedDate}
        onChange={onChange}
        customInput={inputEl}
        placeholderText={placeholderText}
        dayClassName={wrapStr(dayClassName)}
        weekDayClassName={wrapStr(weekDayClassName)}
        monthClassName={wrapStr(monthClassName)}
        timeClassName={wrapStr(timeClassName)}
        renderCustomHeader={renderCustomHeader}
        renderDayContents={renderDayContents}
        renderMonthContent={renderMonthContent}
        renderQuarterContent={renderQuarterContent}
        renderYearContent={renderYearContent}
        {...props}
      />
    </Box>
  );
};

export interface DatePickerRangeProps extends CommonDatePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
}

export const DatePickerRange = ({
  startDate,
  endDate,
  onChange,
  label,
  customInput,
  placeholderText,
  wrapperClassName,
  dayClassName,
  weekDayClassName,
  monthClassName,
  timeClassName,
  renderCustomHeader,
  renderDayContents,
  renderMonthContent,
  renderQuarterContent,
  renderYearContent,
  ...props
}: DatePickerRangeProps) => {
  const inputEl =
    customInput ?? (
      <CustomInput
        label={label}
        placeholder={placeholderText ?? 'Select date range'}
      />
    );

  const wrapStr = (fn?: (d: Date) => string) =>
    fn ? (d: Date) => fn(d) : undefined;

  const handleRangeChange = (dates: [Date | null, Date | null]) => {
    onChange(dates);
  };

  return (
    <Box className={`chakra-datepicker ${wrapperClassName ?? ''}`} w="100%">
      <ReactDatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleRangeChange}
        customInput={inputEl}
        placeholderText={placeholderText}
        dayClassName={wrapStr(dayClassName)}
        weekDayClassName={wrapStr(weekDayClassName)}
        monthClassName={wrapStr(monthClassName)}
        timeClassName={wrapStr(timeClassName)}
        renderCustomHeader={renderCustomHeader}
        renderDayContents={renderDayContents}
        renderMonthContent={renderMonthContent}
        renderQuarterContent={renderQuarterContent}
        renderYearContent={renderYearContent}
        {...props}
      />
    </Box>
  );
};

// Для обратной совместимости
export const DatePicker = {
  Single: DatePickerSingle,
  Range: DatePickerRange,
};

export default DatePicker;