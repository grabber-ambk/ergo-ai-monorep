// components/DatePicker.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DatePickerProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
                                                   name,
                                                   value,
                                                   onChange,
                                                   label,
                                                   disabled = false
                                               }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const calendarRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Converter a string de data para um objeto Date
    useEffect(() => {
        if (value) {
            try {
                const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
                setCurrentDate(parsedDate);
                setCurrentMonth(parsedDate);
            } catch (error) {
                console.error('Erro ao analisar data:', error);
            }
        }
    }, [value]);

    // Fechar o calendário ao clicar fora dele
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    // Gerar dias do mês atual
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const days = [];

        // Preencher dias do mês anterior
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ day: null, isCurrentMonth: false });
        }

        // Preencher dias do mês atual
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, isCurrentMonth: true });
        }

        return days;
    };

    // Mudar para o mês anterior
    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // Mudar para o próximo mês
    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Selecionar uma data
    const selectDate = (day: number) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setCurrentDate(selectedDate);

        // Formatar a data para o formato dd/MM/yyyy
        const formattedDate = format(selectedDate, 'dd/MM/yyyy');

        // Criar um evento sintético para o onChange com nome válido
        const syntheticEvent = {
            target: {
                name: name, // Garante que o nome está sendo passado corretamente
                value: formattedDate
            }
        } as React.ChangeEvent<HTMLInputElement>;

        console.log('Data selecionada:', formattedDate, 'campo:', name);

        // Chamar o onChange passando o evento
        onChange(syntheticEvent);
        setIsOpen(false);
    };

    // Verificar se um dia é o dia selecionado
    const isSelectedDay = (day: number) => {
        if (!currentDate) return false;
        return (
            day === currentDate.getDate() &&
            currentMonth.getMonth() === currentDate.getMonth() &&
            currentMonth.getFullYear() === currentDate.getFullYear()
        );
    };

    // Nomes dos dias da semana em português
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="relative w-full">
            <label className="block text-sm text-gray-500 mb-1">{label}</label>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    onClick={() => !disabled && setIsOpen(true)}
                    className={`w-full p-3 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    readOnly
                    disabled={disabled}
                />
                <div
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
                        !disabled && 'cursor-pointer'
                    }`}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <Calendar size={18} />
                </div>
            </div>

            {isOpen && (
                <div
                    ref={calendarRef}
                    className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-64"
                >
                    <div className="flex justify-between items-center mb-2">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            &lt;
                        </button>
                        <div className="font-medium">
                            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                        </div>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            &gt;
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
                        {weekDays.map(day => (
                            <div key={day}>{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentMonth).map((day, index) => (
                            <div key={index} className="text-center">
                                {day.isCurrentMonth && day.day ? (
                                    <button
                                        type="button"
                                        onClick={() => selectDate(day.day)}
                                        className={`w-7 h-7 rounded-full ${
                                            isSelectedDay(day.day)
                                                ? 'bg-blue-500 text-white'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        {day.day}
                                    </button>
                                ) : (
                                    <div className="w-7 h-7 text-gray-300">{day.day}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;
