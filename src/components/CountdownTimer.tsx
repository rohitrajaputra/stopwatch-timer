import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./countdown-timer.css";

type FieldType = "hour" | "minute" | "second";
type StringOrNumber = any;
type TimeType = {
  hour: StringOrNumber;
  minute: StringOrNumber;
  second: StringOrNumber;
};

const CountdownTimer = () => {
  const initialState = {
    hour: "",
    minute: "",
    second: "",
  };
  const [time, setTime] = useState<TimeType>(initialState);
  const [isRunning, setIsRunning] = useState(false);
  const intervaIdRef = useRef<any>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: FieldType
  ) => {
    const value = Number(event.target.value) || 0;
    const copyTime = { ...time };
    copyTime[field] = value;
    copyTime.minute =
      Number(copyTime.minute) + Number(Math.floor(copyTime.second / 60));
    copyTime.second = copyTime.second % 60;
    copyTime.hour =
      Number(copyTime.hour) + Number(Math.floor(copyTime.minute / 60));
    copyTime.minute = copyTime.minute % 60;

    setTime(copyTime);
  };

  const handleStartClick = () => {
    if (time.hour === "" || time.minute === "" || time.second === "") return;
    setIsRunning(!isRunning);
  };

  const handleResetClick = () => {
    clearInterval(intervaIdRef.current);
    setIsRunning(false);
    setTime(initialState);
  };

  useEffect(() => {
    if (isRunning) {
      intervaIdRef.current = setInterval(() => {
        setTime((prevTime) => {
          const copyPrevTime = { ...prevTime };
          copyPrevTime.second--;
          if (copyPrevTime.second < 0) {
            copyPrevTime.minute--;
            copyPrevTime.second = 59;
            if (copyPrevTime.minute < 0) {
              copyPrevTime.hour--;
              if (copyPrevTime.hour < 0) {
                setIsRunning((_) => false);
                clearInterval(intervaIdRef.current);
                return initialState;
              }
              copyPrevTime.minute = 59;
            }
          }

          return copyPrevTime;
        });
      }, 1000);
    }
    return () => clearInterval(intervaIdRef.current);
  }, [isRunning]);

  return (
    <div className="countdown-container">
      <div className="inputs">
        <input
          onChange={(e) => handleChange(e, "hour")}
          placeholder="HH"
          type="text"
          value={time.hour}
          readOnly={isRunning}
        />
        :
        <input
          onChange={(e) => handleChange(e, "minute")}
          placeholder="MM"
          type="text"
          value={time.minute}
          readOnly={isRunning}
        />
        :
        <input
          onChange={(e) => handleChange(e, "second")}
          placeholder="SS"
          type="text"
          value={time.second}
          readOnly={isRunning}
        />
      </div>
      <div className="buttons">
        <button
          onClick={handleStartClick}
          disabled={
            time.hour === "" || time.minute === "" || time.second === ""
          }
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={handleResetClick}>Reset</button>
      </div>
    </div>
  );
};

export default CountdownTimer;
