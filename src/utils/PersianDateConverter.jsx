import React from 'react';
import { JalaliDateTime } from '@webilix/jalali-date-time';
import { En_To_Fa } from 'persian_util/build/parser';

const JalaliDateConverter = ({ isoDate }) => {
    const convertToJalaliDate = (isoDate) => {
        const jalali = JalaliDateTime();
        const dateObj = new Date(isoDate);
        if (!isNaN(dateObj.getTime())) {
            return jalali.toTitle(dateObj, {
                timezone: 'Asia/Tehran',
                locale: 'en',
                format: 'D N Y',
            });
        } else {
            return ''; // Handle invalid date format
        }
    };

    return (
        <span>{En_To_Fa(convertToJalaliDate(isoDate))}</span>
    );
};

export default JalaliDateConverter;
