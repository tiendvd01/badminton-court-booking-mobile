export const formatVietnameseDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayOfWeek = days[d.getDay()];
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return `${dayOfWeek}, ${day}/${month}/${year}`;
};

export const getCurrentVietnameseDate = (): string => {
    return formatVietnameseDate(new Date());
};
