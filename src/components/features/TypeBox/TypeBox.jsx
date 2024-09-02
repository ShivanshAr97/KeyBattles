import React, { useEffect, useState, useMemo, useRef } from "react";
import { wordsGenerator } from "../../../scripts/wordsGenerator";
import { FaUndo } from "react-icons/fa";
import { MdRestartAlt } from "react-icons/md";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import useLocalPersistState from "../../../hooks/useLocalPersistState";
import CapsLockSnackbar from "../CapsLockSnackbar";
import Stats from "./Stats";
import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import {
  DEFAULT_COUNT_DOWN,
  COUNT_DOWN_90,
  COUNT_DOWN_60,
  COUNT_DOWN_30,
  COUNT_DOWN_15,
  DEFAULT_WORDS_COUNT,
  PACING_CARET,
  PACING_PULSE,
} from "../../../constants/Constants";
import EnglishModeWords from "../../common/EnglishModeWords";

const TypeBox = ({ textInputRef, handleInputFocus, theme }) => {
  const [incorrectCharsCount, setIncorrectCharsCount] = useState(0);

  const [countDownConstant, setCountDownConstant] = useLocalPersistState(
    DEFAULT_COUNT_DOWN,
    "timer-constant"
  );
  const [pacingStyle, setPacingStyle] = useLocalPersistState(
    PACING_PULSE,
    "pacing-style"
  );

  const [capsLocked, setCapsLocked] = useState(false);
  const [openRestart, setOpenRestart] = useState(false);
  const EnterkeyPressReset = (e) => {
    if (e.keyCode === 13 || e.keyCode === 9) {
      e.preventDefault();
      setOpenRestart(false);
      reset(countDownConstant, false);
    } else if (e.keyCode === 32) {
      e.preventDefault();
      setOpenRestart(false);
      reset(countDownConstant, true);
    } else {
      e.preventDefault();
      setOpenRestart(false);
    }
  };
  const handleTabKeyOpen = () => {
    setOpenRestart(true);
  };

  const [wordsDict, setWordsDict] = useState(() => {
    return wordsGenerator(DEFAULT_WORDS_COUNT);
  });
  const words = useMemo(() => {
    return wordsDict.map((e) => e.val);
  }, [wordsDict]);
  const wordSpanRefs = useMemo(
    () =>
      Array(words.length)
        .fill(0)
        .map((i) => React.createRef()),
    [words]
  );

  const [countDown, setCountDown] = useState(countDownConstant);
  const [intervalId, setIntervalId] = useState(null);
  const [status, setStatus] = useState("waiting");
  const menuEnabled = status === "finished";
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [prevInput, setPrevInput] = useState("");
  const [wordsCorrect, setWordsCorrect] = useState(new Set());
  const [wordsInCorrect, setWordsInCorrect] = useState(new Set());
  const [inputWordsHistory, setInputWordsHistory] = useState({});
  const [rawKeyStrokes, setRawKeyStrokes] = useState(0);
  const [wpmKeyStrokes, setWpmKeyStrokes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [statsCharCount, setStatsCharCount] = useState([]);
  const [history, setHistory] = useState({});
  const keyString = currWordIndex + "." + currCharIndex;
  const [currChar, setCurrChar] = useState("");

  useEffect(() => {
    if (currWordIndex === DEFAULT_WORDS_COUNT - 1) {
      const generatedEng = wordsGenerator(DEFAULT_WORDS_COUNT);
      setWordsDict((currentArray) => [...currentArray, ...generatedEng]);
    }
    if (wordSpanRefs[currWordIndex]) {
      const scrollElement = wordSpanRefs[currWordIndex].current;
      if (scrollElement) {
        scrollElement.scrollIntoView({
          block: "center",
        });
      }
    } else {
      return;
    }
  }, [currWordIndex, wordSpanRefs]);

  const reset = (newCountDown, isRedo) => {
    setStatus("waiting");
    if (!isRedo) {
      setWordsDict(wordsGenerator(DEFAULT_WORDS_COUNT));
    }
    setCountDownConstant(newCountDown);
    setCountDown(newCountDown);
    clearInterval(intervalId);
    setWpm(0);
    setRawKeyStrokes(0);
    setWpmKeyStrokes(0);
    setCurrInput("");
    setPrevInput("");
    setIntervalId(null);
    setCurrWordIndex(0);
    setCurrCharIndex(-1);
    setCurrChar("");
    setHistory({});
    setInputWordsHistory({});
    setWordsCorrect(new Set());
    setWordsInCorrect(new Set());
    textInputRef.current.focus();
    wordSpanRefs[0].current.scrollIntoView();
  };

  const start = () => {
    if (status === "finished") {
      setCurrInput("");
      setPrevInput("");
      setCurrWordIndex(0);
      setCurrCharIndex(-1);
      setCurrChar("");
      setHistory({});
      setInputWordsHistory({});
      setWordsCorrect(new Set());
      setWordsInCorrect(new Set());
      setStatus("waiting");
      textInputRef.current.focus();
    }

    if (status !== "started") {
      setStatus("started");
      let intervalId = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(intervalId);
            const currCharExtraCount = Object.values(history)
              .filter((e) => typeof e === "number")
              .reduce((a, b) => a + b, 0);
            const currCharCorrectCount = Object.values(history).filter(
              (e) => e === true
            ).length;
            const currCharIncorrectCount = Object.values(history).filter(
              (e) => e === false
            ).length;
            const currCharMissingCount = Object.values(history).filter(
              (e) => e === undefined
            ).length;

            const currCharAdvancedCount =
              currCharCorrectCount +
              currCharMissingCount +
              currCharIncorrectCount;
            const accuracy =
              currCharCorrectCount === 0
                ? 0
                : (currCharCorrectCount / currCharAdvancedCount) * 100;

            setStatsCharCount([
              accuracy,
              currCharCorrectCount,
              currCharIncorrectCount,
              currCharMissingCount,
              currCharAdvancedCount,
              currCharExtraCount,
            ]);

            checkPrev();
            setStatus("finished");

            return countDownConstant;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
      setIntervalId(intervalId);
    }
  };

  const UpdateInput = (e) => {
    if (status === "finished") {
      return;
    }
    setCurrInput(e.target.value);
    inputWordsHistory[currWordIndex] = e.target.value.trim();
    setInputWordsHistory(inputWordsHistory);
  };

  const handleKeyUp = (e) => {
    setCapsLocked(e.getModifierState("CapsLock"));
  };

  const wpmWorkerRef = useRef(null);

  useEffect(() => {
    wpmWorkerRef.current = new Worker(
      new URL("../../../worker/calculateWpmWorker", import.meta.url)
    );

    return () => {
      if (wpmWorkerRef.current) {
        wpmWorkerRef.current.terminate();
      }
    };
  }, []);

  const calculateWpm = (wpmKeyStrokes, countDownConstant, countDown) => {
    if (wpmKeyStrokes !== 0) {
      if (!wpmWorkerRef.current) return;

      wpmWorkerRef.current.postMessage({
        wpmKeyStrokes,
        countDownConstant,
        countDown,
      });

      wpmWorkerRef.current.onmessage = (event) => {
        setWpm(event.data);
      };

      wpmWorkerRef.current.onerror = (error) => {
        console.error("Worker error:", error);
      };
    }
  };

  const handleKeyDown = (e) => {
    const key = e.key;
    const keyCode = e.keyCode;
    setCapsLocked(e.getModifierState("CapsLock"));
    if (status === "started") {
      setRawKeyStrokes(rawKeyStrokes + 1);
      if (keyCode >= 65 && keyCode <= 90) {
        setWpmKeyStrokes(wpmKeyStrokes + 1);
      }
    }
    if (keyCode === 20) {
      e.preventDefault();
      return;
    }
    if (keyCode >= 16 && keyCode <= 18) {
      e.preventDefault();
      return;
    }
    if (keyCode === 9) {
      e.preventDefault();
      handleTabKeyOpen();
      return;
    }

    if (status === "finished") {
      setCurrInput("");
      setPrevInput("");
      return;
    }
    if (wpmKeyStrokes !== 0) {
      calculateWpm(wpmKeyStrokes, countDownConstant, countDown);
    }
    if (status !== "started" && status !== "finished") {
      start();
    }
    if (keyCode === 32) {
      const prevCorrectness = checkPrev();
      if (prevCorrectness === true || prevCorrectness === false) {
        if (
          words[currWordIndex].split("").length > currInput.split("").length
        ) {
          setIncorrectCharsCount((prev) => prev + 1);
        }

        setCurrInput("");
        setCurrWordIndex(currWordIndex + 1);
        setCurrCharIndex(-1);
        return;
      } else {
        return;
      }
    } else if (keyCode === 8) {
      delete history[keyString];

      if (currCharIndex < 0) {
        if (wordsInCorrect.has(currWordIndex - 1)) {
          const prevInputWord = inputWordsHistory[currWordIndex - 1];
          setCurrInput(prevInputWord + " ");
          setCurrCharIndex(prevInputWord.length - 1);
          setCurrWordIndex(currWordIndex - 1);
          setPrevInput(prevInputWord);
        }
        return;
      }
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
      return;
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
      return;
    }
  };

  const getExtraCharClassName = (i, idx, extra) => {
    if (
      pacingStyle === PACING_CARET &&
      currWordIndex === i &&
      idx === extra.length - 1
    ) {
      return "caret-extra-char-right-error";
    }
    return "error-char";
  };

  const getExtraCharsDisplay = (word, i) => {
    let input = inputWordsHistory[i];
    if (!input) {
      input = currInput.trim();
    }
    if (i > currWordIndex) {
      return null;
    }
    if (input.length <= word.length) {
      return null;
    } else {
      const extra = input.slice(word.length, input.length).split("");
      history[i] = extra.length;
      return extra.map((c, idx) => (
        <span key={idx} className={getExtraCharClassName(i, idx, extra)}>
          {c}
        </span>
      ));
    }
  };

  const checkPrev = () => {
    const wordToCompare = words[currWordIndex];
    const currInputWithoutSpaces = currInput.trim();
    const isCorrect = wordToCompare === currInputWithoutSpaces;
    if (!currInputWithoutSpaces || currInputWithoutSpaces.length === 0) {
      return null;
    }
    if (isCorrect) {
      wordsCorrect.add(currWordIndex);
      wordsInCorrect.delete(currWordIndex);
      let inputWordsHistoryUpdate = { ...inputWordsHistory };
      inputWordsHistoryUpdate[currWordIndex] = currInputWithoutSpaces;
      setInputWordsHistory(inputWordsHistoryUpdate);
      setPrevInput("");
      setWpmKeyStrokes(wpmKeyStrokes + 1);
      return true;
    } else {
      wordsInCorrect.add(currWordIndex);
      wordsCorrect.delete(currWordIndex);
      let inputWordsHistoryUpdate = { ...inputWordsHistory };
      inputWordsHistoryUpdate[currWordIndex] = currInputWithoutSpaces;
      setInputWordsHistory(inputWordsHistoryUpdate);
      setPrevInput(prevInput + " " + currInputWithoutSpaces);
      return false;
    }
  };

  const getWordClassName = (wordIdx) => {
    if (wordsInCorrect.has(wordIdx)) {
      if (currWordIndex === wordIdx) {
        if (pacingStyle === PACING_PULSE) {
          return "word error-word active-word";
        } else {
          return "word error-word active-word-no-pulse";
        }
      }
      return "word error-word";
    } else {
      if (currWordIndex === wordIdx) {
        if (pacingStyle === PACING_PULSE) {
          return "word active-word";
        } else {
          return "word active-word-no-pulse";
        }
      }
      return "word";
    }
  };

  const charsWorkerRef = useRef();

  useEffect(() => {
    charsWorkerRef.current = new Worker(
      new URL("../../../worker/trackCharsErrorsWorker", import.meta.url)
    );

    charsWorkerRef.current.onmessage = (e) => {
      if (e.data.type === "increment") {
        setIncorrectCharsCount((prev) => prev + 1);
      }
    };

    return () => {
      charsWorkerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    if (status !== "started") return;

    const word = words[currWordIndex];

    charsWorkerRef.current.postMessage({
      word,
      currChar,
      currCharIndex,
    });
  }, [currChar, status, currCharIndex, words, currWordIndex]);

  const getCharClassName = (wordIdx, charIdx, char, word) => {
    const keyString = wordIdx + "." + charIdx;
    if (
      pacingStyle === PACING_CARET &&
      wordIdx === currWordIndex &&
      charIdx === currCharIndex + 1 &&
      status !== "finished"
    ) {
      return "caret-char-left";
    }
    if (history[keyString] === true) {
      if (
        pacingStyle === PACING_CARET &&
        wordIdx === currWordIndex &&
        word.length - 1 === currCharIndex &&
        charIdx === currCharIndex &&
        status !== "finished"
      ) {
        return "caret-char-right-correct";
      }
      return "correct-char";
    }
    if (history[keyString] === false) {
      if (
        pacingStyle === PACING_CARET &&
        wordIdx === currWordIndex &&
        word.length - 1 === currCharIndex &&
        charIdx === currCharIndex &&
        status !== "finished"
      ) {
        return "caret-char-right-error";
      }

      return "error-char";
    }
    if (
      wordIdx === currWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (char === currChar) {
        history[keyString] = true;
        return "correct-char";
      } else {
        history[keyString] = false;
        return "error-char";
      }
    } else {
      if (wordIdx < currWordIndex) {
        history[keyString] = undefined;
      }

      return "char";
    }
  };

  const getPacingStyleButtonClassName = (buttonPacingStyle) => {
    if (pacingStyle === buttonPacingStyle) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getTimerButtonClassName = (buttonTimerCountDown) => {
    if (countDownConstant === buttonTimerCountDown) {
      return "active-button";
    }
    return "inactive-button";
  };

  const renderResetButton = () => {
    return (
      <div className="restart-button" key="restart-button">
        <Grid container justifyContent="center" alignItems="center">
          <Box display="flex" flexDirection="row">
            <button
              className="btn"
              aria-label="redo"
              color="secondary"
              size="medium"
              onClick={() => {
                reset(countDownConstant, true);
              }}
            >
              <FaUndo />
            </button>
            <button
              className="btn"
              aria-label="restart"
              color="secondary"
              onClick={() => {
                reset(countDownConstant, false);
              }}
            >
              <MdRestartAlt size="20px" />
            </button>
            {!menuEnabled && (
              <>
                <button
                  className="btn"
                  onClick={() => {
                    reset(COUNT_DOWN_90, false);
                  }}
                >
                  <span className={getTimerButtonClassName(COUNT_DOWN_90)}>
                    {COUNT_DOWN_90}
                  </span>
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    reset(COUNT_DOWN_60, false);
                  }}
                >
                  <span className={getTimerButtonClassName(COUNT_DOWN_60)}>
                    {COUNT_DOWN_60}
                  </span>
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    reset(COUNT_DOWN_30, false);
                  }}
                >
                  <span className={getTimerButtonClassName(COUNT_DOWN_30)}>
                    {COUNT_DOWN_30}
                  </span>
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    reset(COUNT_DOWN_15, false);
                  }}
                >
                  <span className={getTimerButtonClassName(COUNT_DOWN_15)}>
                    {COUNT_DOWN_15}
                  </span>
                </button>
              </>
            )}
          </Box>
          <Box display="flex" flexDirection="row">
            <button
            className="btn"
              onClick={() => {
                setPacingStyle(PACING_PULSE);
              }}
            >
              <span className={getPacingStyleButtonClassName(PACING_PULSE)}>
                {PACING_PULSE}
              </span>
            </button>
            <button
            className="btn"
              onClick={() => {
                setPacingStyle(PACING_CARET);
              }}
            >
              <span className={getPacingStyleButtonClassName(PACING_CARET)}>
                {PACING_CARET}
              </span>
            </button>
          </Box>
        </Grid>
      </div>
    );
  };

  const baseChunkSize = 120;
  const [startIndex, setStartIndex] = useState(0);
  const [visibleWordsCount, setVisibleWordsCount] = useState(baseChunkSize);
  useEffect(() => {
    setStartIndex(0);
  }, [status]);

  useEffect(() => {
    const endIndex = startIndex + visibleWordsCount;
    if (currWordIndex >= endIndex - 5) {
      const newStartIndex = Math.max(
        0,
        Math.min(
          currWordIndex - Math.floor(visibleWordsCount / 2),
          words.length - visibleWordsCount
        )
      );

      if (newStartIndex !== startIndex) {
        setStartIndex(newStartIndex);
        setVisibleWordsCount(
          Math.min(words.length - newStartIndex, baseChunkSize)
        );
      }
    }
  }, [currWordIndex, startIndex, words.length, visibleWordsCount]);

  const endIndex = useMemo(
    () => Math.min(startIndex + visibleWordsCount, words.length),
    [startIndex, visibleWordsCount, words.length]
  );

  const currentWords = useMemo(
    () => words.slice(startIndex, endIndex),
    [startIndex, endIndex, words]
  );

  return (
    <>
      <div onClick={handleInputFocus}>
        <CapsLockSnackbar open={capsLocked}></CapsLockSnackbar>
        <EnglishModeWords
          currentWords={currentWords}
          currWordIndex={currWordIndex}
          startIndex={startIndex}
          status={status}
          wordSpanRefs={wordSpanRefs}
          getWordClassName={getWordClassName}
          getCharClassName={getCharClassName}
          getExtraCharsDisplay={getExtraCharsDisplay}
        />
        <div className="stats">
          <Stats
            status={status}
            wpm={wpm}
            setIncorrectCharsCount={setIncorrectCharsCount}
            incorrectCharsCount={incorrectCharsCount}
            theme={theme}
            countDown={countDown}
            countDownConstant={countDownConstant}
            statsCharCount={statsCharCount}
            rawKeyStrokes={rawKeyStrokes}
            wpmKeyStrokes={wpmKeyStrokes}
            renderResetButton={renderResetButton}
          ></Stats>
          {status !== "finished" && renderResetButton()}
        </div>
        <input
          key="hidden-input"
          ref={textInputRef}
          type="text"
          className="hidden-input"
          onKeyDown={(e) => handleKeyDown(e)}
          onKeyUp={(e) => handleKeyUp(e)}
          value={currInput}
          onChange={(e) => UpdateInput(e)}
        />
        <Dialog
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }}
          open={openRestart}
          onKeyDown={EnterkeyPressReset}
        >
          <DialogTitle>
            <div>
              <span className="key-note"> press </span>
              <span className="key-type">Space</span>{" "}
              <span className="key-note">to redo</span>
            </div>
            <div>
              <span className="key-note"> press </span>
              <span className="key-type">Tab</span>{" "}
              <span className="key-note">/</span>{" "}
              <span className="key-type">Enter</span>{" "}
              <span className="key-note">to restart</span>
            </div>
            <span className="key-note"> press </span>
            <span className="key-type">any key </span>{" "}
            <span className="key-note">to exit</span>
          </DialogTitle>
        </Dialog>
      </div>
    </>
  );
};

export default TypeBox;
