import mitt from 'mitt';
import dayjs from 'dayjs';

export interface LogData {
  time: string;
  text: string;
  key: string;
}

type Events = {
  addLog: LogData;
};

export const emitter = mitt<Events>();

export enum MITTER_EVENT_ENUM {
  addLog = 'addLog',
}

// fire an event
export const addLogEvent = (text: string) => {
  emitter.emit(MITTER_EVENT_ENUM.addLog, {
    time: dayjs().format('HH:MM:ss'),
    text,
    key: dayjs().unix().toString(),
  } as LogData);
};
