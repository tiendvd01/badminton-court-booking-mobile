import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { format, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';

interface DatePickerProps {
    onDateSelect?: (date: string) => void;
    initialDate?: string; // Format: 'YYYY-MM-DD'
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelect, initialDate = format(new Date(), 'yyyy-MM-dd') }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const handleDateSelect = (day: DateData) => {
        setSelectedDate(day.dateString);
        setIsVisible(false);
        if (onDateSelect) {
            onDateSelect(day.dateString);
        }
    };

    const formatDisplayDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
    };

    // Mark today and selected date
    const markedDates = {
        [selectedDate]: { selected: true, selectedColor: '#2E7D32' },
        [format(new Date(), 'yyyy-MM-dd')]: { marked: true, dotColor: '#2E7D32' },
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.dateButton} onPress={() => setIsVisible(true)}>
                <Text style={styles.dateText}>{formatDisplayDate(selectedDate)}</Text>
                <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>

            <Modal
                isVisible={isVisible}
                onBackdropPress={() => setIsVisible(false)}
                style={styles.modal}
                backdropTransitionOutTiming={0}
            >
                <View style={styles.modalContent}>
                    <Calendar
                        current={selectedDate}
                        minDate={format(new Date(), 'yyyy-MM-dd')}
                        maxDate={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                        onDayPress={handleDateSelect}
                        markedDates={markedDates}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#2E7D32',
                            selectedDayBackgroundColor: '#2E7D32',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#2E7D32',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#d9e1e8',
                            dotColor: '#2E7D32',
                            selectedDotColor: '#ffffff',
                            arrowColor: '#2E7D32',
                            monthTextColor: '#2E7D32',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 14,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 14,
                        }}
                        style={styles.calendar}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setIsVisible(false)}>
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    dateText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    calendarIcon: {
        fontSize: 18,
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        maxHeight: '80%',
    },
    calendar: {
        borderRadius: 10,
        marginBottom: 15,
    },
    closeButton: {
        backgroundColor: '#2E7D32',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DatePicker;
