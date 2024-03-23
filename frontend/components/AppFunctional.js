import React, { useState } from 'react';
import axios from 'axios';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

const theGrid = [
  '(1,1)',
  '(2,1)',
  '(3,1)',
  '(1,2)',
  '(2,2)',
  '(3,2)',
  '(1,3)',
  '(2,3)',
  '(3,3)',
];

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    return theGrid[index];
  }

  function getXYMesaj() {
    const coordinates = getXY();
    const [x, y] = coordinates.slice(1, -1).split(',');

    if (x === '1' && y === '1') {
      return 'Sol ve Yukarı yönünde gidebileceğiniz bir kare kalmadı!';
    } else if (x === '1' && y === '3') {
      return 'Sol ve Aşağı yönünde gidebileceğiniz bir kare kalmadı!';
    } else if (x === '3' && y === '1') {
      return 'Sağ ve Yukarı yönünde gidebileceğiniz bir kare kalmadı!';
    } else if (x === '3' && y === '3') {
      return 'Sağ ve Aşağı yönünde gidebileceğiniz bir kare kalmadı!';
    } else if (x === '1') {
      return 'Sol yönünde gidebileceğiniz bir kare kalmadı!';
    } else if (x === '3') {
      return 'Sağ yönünde gidebileceğiniz bir kare kalmadı!';
    } else if (y === '1') {
      return 'Yukarı yönünde gidebileceğiniz bir kare kalmadı!';
    } else if (y === '3') {
      return 'Aşağı yönünde gidebileceğiniz bir kare kalmadı!';
    } else {
      return `Koordinatlar ${coordinates}`;
    }
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function sonrakiIndex(yon) {
    let nextIndex;
    switch (yon) {
      case 'sol':
        nextIndex = index - 1;
        if (nextIndex % 3 === 2) {
          nextIndex = index;
        }
        break;
      case 'yukarı':
        nextIndex = index - 3;
        if (nextIndex < 0) {
          nextIndex = index;
        }
        break;
      case 'sağ':
        nextIndex = index + 1;
        if (nextIndex % 3 === 0) {
          nextIndex = index;
        }
        break;
      case 'aşağı':
        nextIndex = index + 3;
        if (nextIndex > 8) {
          nextIndex = index;
        }
        break;
      default:
        nextIndex = index;
        break;
    }
    return nextIndex;
  }

  function ilerle(yon) {
    const nextIndex = sonrakiIndex(yon);
    setIndex(nextIndex);
    setSteps(steps + 1);
    setMessage(getXYMesaj());
  }

  function onChange(evt) {
    const { id, value } = evt.target;
    switch (id) {
      case 'email':
        setEmail(value);
        break;
      default:
        break;
    }
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const theData = {
      x: theGrid[index][1],
      y: theGrid[index][3],
      steps: steps,
      email: email,
    };

    setEmail(initialEmail);

    const config = {
      method: 'post',
      url: 'http://localhost:9000/api/result',
      headers: {
        'Content-Type': 'application/json',
      },
      data: theData,
    };

    axios(config)
      .then(function (response) {
        setMessage(response.data.message);
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar {getXY()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {theGrid.map((coordinates, idx) => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => ilerle('sol')}>
          SOL
        </button>
        <button id="up" onClick={() => ilerle('yukarı')}>
          YUKARI
        </button>
        <button id="right" onClick={() => ilerle('sağ')}>
          SAĞ
        </button>
        <button id="down" onClick={() => ilerle('aşağı')}>
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          Reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          value={email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
