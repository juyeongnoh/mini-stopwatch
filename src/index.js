// TODO: 이 곳에 정답 코드를 작성해주세요.
// 1. HTML 태그의 class, id는 수정하지 않고 그대로 사용합니다.
// 2. 모든 DOM은 HTML에 명시된 id를 선택자로 사용해 가져옵니다.
// 3. CSS 파일은 수정하지 않습니다.
// 4. 기본적으로 정답은 index.js 파일에 작성하되, 다른 js 파일을 생성해 작성하는 것도 가능합니다.
// 5. 기본 코드의 package.json에 명시된 라이브러리 외의 별도의 라이브러리 설치를 허용하지 않습니다.
// 6. 스톱워치 기능은 src/stopwatch.js 모듈을 이용해 구현해 주세요. 하단의 타이머 모듈 설명을 참고하세요.
// 7. 스톱워치의 단위는 centisecond (1/100초)를 사용합니다.

import Stopwatch from './stopwatch.js';

// 요구사항 1. 시작, 중단 기능
const $startStopBtn = document.getElementById('start-stop-btn');
const $startStopBtnLabel = document.getElementById('start-stop-btn-label');
const $lapResetBtn = document.getElementById('lap-reset-btn');
const $lapResetBtnLabel = document.getElementById('lap-reset-btn-label');
const $timer = document.getElementById('timer');
const stopWatch = new Stopwatch();

let interval;
let isRunning = false;

/**
 * Class Node를 스위칭합니다.
 * @param {HTMLElement} targetElement
 * @param {string} toRemove
 * @param {string} toAdd
 */
const switchClassNode = (targetElement, toRemove, toAdd) => {
  targetElement.classList.remove(toRemove);
  targetElement.classList.add(toAdd);
};

$startStopBtn.addEventListener('click', () => {
  isRunning = !isRunning;
  $startStopBtnLabel.innerText = isRunning ? '중단' : '시작';
  $lapResetBtnLabel.innerText = isRunning ? '랩' : '리셋';

  if (isRunning) {
    switchClassNode($startStopBtn, 'bg-green-600', 'bg-red-600');
    stopWatch.start();
    interval = setInterval(() => {
      $timer.innerText = formatCentisecond(stopWatch.centisecond);
    }, 10);
  } else {
    switchClassNode($startStopBtn, 'bg-red-600', 'bg-green-600');
    stopWatch.pause();
    clearInterval(interval);
  }
});

// 2. 시간 포맷팅 구현
/**
 * 센티초를 [HH]:MM:SS.cc 형태로 포맷팅하여 리턴합니다.
 * @param {number} centisecond
 */
const formatCentisecond = (centisecond) => {
  let hour = parseInt(centisecond / 360000);
  let minute = String(parseInt(centisecond / 6000)).padStart(2, 0);
  let second = String(parseInt(centisecond / 100)).padStart(2, 0);
  let rest = String(centisecond % 100).padStart(2, 0);

  return hour
    ? `${hour}:${minute}:${second}.${rest}`
    : `${minute}:${second}.${rest}`;
};

// 3. 랩 기능 구현
// 4. 리셋 기능
// 6. 최단, 최장 기록 강조 효과
const $laps = document.getElementById('laps');

let laps = [];

let [longestIndex, longestLap] = [0, -1];
let [shortestIndex, shortestLap] = [0, -1];

$lapResetBtn.addEventListener('click', () => {
  if (isRunning) {
    laps.push(stopWatch.createLap());
    $laps.innerText = '';

    const [currentIndex, currentLap] = laps[laps.length - 1];

    if (longestLap === -1) {
      [longestIndex, longestLap] = [currentIndex, currentLap];
    } else {
      [longestIndex, longestLap] =
        longestLap < currentLap
          ? [currentIndex, currentLap]
          : [longestIndex, longestLap];
    }

    if (shortestLap === -1) {
      [shortestIndex, shortestLap] = [currentIndex, currentLap];
    } else {
      [shortestIndex, shortestLap] =
        shortestLap > currentLap
          ? [currentIndex, currentLap]
          : [shortestIndex, shortestLap];
    }

    for (let i = laps.length - 1; i >= 0; i--) {
      const [lapCount, centisecond] = laps[i];
      const isLongest = i === longestIndex - 1;
      const isShortest = i === shortestIndex - 1;

      const $lap = document.createElement('li');
      const $span1 = document.createElement('span');
      const $span2 = document.createElement('span');

      $lap.appendChild($span1);
      $lap.appendChild($span2);

      if (laps.length <= 1) {
        $lap.classList.value = 'flex justify-between py-2 px-3 border-b-2';
      } else {
        $lap.classList.value = `flex justify-between py-2 px-3 border-b-2 ${
          isLongest && 'text-red-600'
        } ${isShortest && 'text-green-600'}`;
      }
      $span1.innerText = `랩 ${lapCount}`;
      $span2.innerText = formatCentisecond(centisecond);

      $laps.appendChild($lap);
    }
  } else {
    stopWatch.reset();
    $timer.innerText = formatCentisecond(stopWatch.centisecond);
    $laps.innerText = '';
    laps = [];
  }
});

// 5. 키보드 조작 기능
document.addEventListener('keydown', (e) => {
  const key = e.code;
  if (key === 'KeyL') $lapResetBtn.click();
  else if (key === 'KeyS') $startStopBtn.click();
});
