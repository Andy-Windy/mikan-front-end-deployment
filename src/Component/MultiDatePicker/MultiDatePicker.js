import React, { useState, memo, useMemo, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, Popover } from '@material-ui/core';
import { debounce } from 'lodash';
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  calendarContainer: {
    maxWidth: '350px',
    minWidth: '280px',
    margin: '0 auto',
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  weekDayHeader: {
    display: 'grid',
    gridTemplateColumns: (props) => (props.mode === 0 ? 'repeat(7, 1fr)' : '50px repeat(7, 1fr)'),
    gap: '4px',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  dayContainer: {
    display: 'grid',
    gridTemplateColumns: (props) => (props.mode === 0 ? 'repeat(7, 1fr)' : '50px repeat(7, 1fr)'),
    gap: '4px',
  },
  weekNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    minWidth: '50px',
  },
  dayButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    border: '1px solid #ccc',
    aspectRatio: '1 / 1',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  selectedDay: {
    backgroundColor: '#3f51b5',
    color: '#fff',
    border: 'none',
  },
  emptyDay: {
    visibility: 'hidden',
  },
}));
const CustomDatePicker = memo(({ mode = 2, value = [], onChange }) => {
  const classes = useStyles({ mode });

  // 星期标题
  const weekDays = useMemo(() => ['一', '二', '三', '四', '五', '六', '七'], []);

  // 生成1到35天的数组
  const days = useMemo(() => Array.from({ length: 35 }, (_, i) => i + 1), []);

  // 计算1号是星期几（假设1号是星期一）
  const startDayOfWeek = 1; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // 生成空白占位符（确保1号是星期一）
  const emptyDays = useMemo(
    () => Array(startDayOfWeek - 1).fill(null).map((_, i) => i + 1),
    [startDayOfWeek]
  );

  // 将日期分组成周
  const weeks = useMemo(() => {
    const weeks = [];
    let currentWeek = [];
    let weekNumber = 1;

    // 添加空白占位符
    emptyDays.forEach(() => {
      currentWeek.push(null);
    });

    // 将日期分配到周中
    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push({ weekNumber, days: currentWeek });
        currentWeek = [];
        weekNumber++;
      }
    });

    // 如果最后一周不足7天，补全
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push({ weekNumber, days: currentWeek });
    }

    return weeks;
  }, [days, emptyDays]);

  // 处理日期选择
  const handleDayClick = useCallback(
    (day) => {
      const newSelectedDays = new Set(value); // 使用 value 而不是 selectedDays
      if (newSelectedDays.has(day)) {
        newSelectedDays.delete(day); // 取消选择
      } else {
        newSelectedDays.add(day); // 添加选择
      }
      onChange([...newSelectedDays]); // 确保传递的是数组
    },
    [value, onChange]
  );

  return (
    <div className={classes.calendarContainer}>
      <Typography variant="h6" align="center" gutterBottom>
        选择日期
      </Typography>

      {/* 星期标题 */}
      {mode !== 0 && (
        <div className={classes.weekDayHeader}>
          {mode !== 0 && <div></div>}
          {weekDays.map((day) => (
            <Typography key={day} variant="body2" align="center">
              {day}
            </Typography>
          ))}
        </div>
      )}

      {/* 日期按钮 */}
      <div className={classes.dayContainer}>
        {weeks.map((week) => (
          <React.Fragment key={week.weekNumber}>
            {/* 显示周数 */}
            {mode !== 0 && (
              <div className={classes.weekNumber}>第{week.weekNumber}周</div>
            )}

            {/* 显示日期 */}
            {week.days.map((day, index) => {
              // 当 mode 为 0 时，隐藏 32-35 的日期
              if (mode === 0 && day && day >= 32) {
                return null;
              }

              return day ? (
                <div
                  key={day}
                  className={`${classes.dayButton} ${
                    value.includes(day) ? classes.selectedDay : ''
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  {mode === 1 ? '' : day}
                </div>
              ) : (
                <div key={`empty-${index}`} className={`${classes.dayButton} ${classes.emptyDay}`} />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});

const MultiDatePicker = memo(({ mode = 2, value = [], onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenPicker = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePicker = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // 确保 value 是一个数组
  const safeValue = Array.isArray(value) ? value : [];

  return (
    <Box display="flex" alignItems="flex-end" flexGrow={1}>
      <TextField
        value={safeValue.join(', ')} // 使用 safeValue
        onClick={handleOpenPicker}
        placeholder="选择日期"
        fullWidth
        InputProps={{ readOnly: true }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableAutoFocus // 防止 Popover 自动获取焦点
        disableEnforceFocus // 防止 Popover 强制焦点
        disableRestoreFocus // 防止 Popover 关闭时恢复焦点
      >
        <CustomDatePicker
          mode={mode}
          value={safeValue} // 使用 safeValue
          onChange={onChange}
        />
      </Popover>
    </Box>
  );
});

export default MultiDatePicker;