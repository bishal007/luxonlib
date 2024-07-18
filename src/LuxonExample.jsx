import React, { useState, useEffect } from "react";
import { DateTime, Interval, Duration } from "luxon";

const LuxonExample = () => {
  const [currentTime, setCurrentTime] = useState(() => DateTime.local());
  const [countdown, setCountdown] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime((prevTime) => {
        try {
          return DateTime.local();
        } catch (err) {
          setError("Error updating current time");
          return prevTime;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const newYears = DateTime.local(currentTime.year + 1, 1, 1, 0, 0, 0);
      if (!newYears.isValid) {
        throw new Error("Invalid New Year's date");
      }

      const interval = Interval.fromDateTimes(currentTime, newYears);
      if (!interval.isValid) {
        throw new Error("Invalid interval");
      }

      const remaining = interval.toDuration([
        "days",
        "hours",
        "minutes",
        "seconds",
      ]);
      if (!remaining.isValid) {
        throw new Error("Invalid duration");
      }

      setCountdown(
        `${remaining.days} days, ${remaining.hours} hours, ${
          remaining.minutes
        } minutes, ${Math.floor(remaining.seconds)} seconds`
      );
    } catch (err) {
      setError(`Error calculating countdown: ${err.message}`);
    }
  }, [currentTime]);

  const formatDate = (date, format) => {
    try {
      if (!date.isValid) {
        throw new Error("Invalid date");
      }
      return date.toFormat(format);
    } catch (err) {
      setError(`Error formatting date: ${err.message}`);
      return "Invalid Date";
    }
  };

  const addWeeks = (date, weeks) => {
    try {
      const newDate = date.plus({ weeks });
      if (!newDate.isValid) {
        throw new Error("Invalid result after adding weeks");
      }
      return newDate;
    } catch (err) {
      setError(`Error adding weeks: ${err.message}`);
      return date;
    }
  };

  const getNewYorkTime = (date) => {
    try {
      const nyTime = date.setZone("America/New_York");
      if (!nyTime.isValid) {
        throw new Error("Invalid New York time");
      }
      return nyTime.toFormat("HH:mm:ss");
    } catch (err) {
      setError(`Error getting New York time: ${err.message}`);
      return "Unable to get New York time";
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Luxon Example</h1>
      <p>Current Time: {formatDate(currentTime, "yyyy-MM-dd HH:mm:ss")}</p>
      <p>Countdown to New Year: {countdown}</p>
      <p>
        Date in 2 weeks: {formatDate(addWeeks(currentTime, 2), "yyyy-MM-dd")}
      </p>
      <p>Current time in New York: {getNewYorkTime(currentTime)}</p>
      <p>Is Daylight Saving Time? {currentTime.isInDST ? "Yes" : "No"}</p>
    </div>
  );
};

export default LuxonExample;
