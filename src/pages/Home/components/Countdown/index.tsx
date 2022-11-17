import { differenceInSeconds } from "date-fns";
import { useContext, useEffect } from "react";
import { CyclesContext } from "../../../../contexts/CycleContext";
import { CountdownContainer, Separator } from "./styles";

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0; // o user poe em minutos, mas transformamos em segundos o total

  useEffect(() => {
    let timer: number;

    if (activeCycle) {
      timer = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished();
          setSecondsPassed(totalSeconds);
          clearInterval(timer);
        } else {
          setSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ]);

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesPassed = Math.floor(currentSeconds / 60); // quantidade dos minutos que passaram, ou seja, dos dois primeiros digitos
  const secondsAmount = currentSeconds % 60; // se eu dividir todos os segundos por 60, quantos segundos sobram que não cabem em mais uma divisão

  const minutes = String(minutesPassed).padStart(2, "0"); // Se os minutos não tiverem ao menos 2 carácteres (números abaixo de 10), eu quero que o primeiro carácter seja 0
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    activeCycle
      ? (document.title = `${minutes}:${seconds}`)
      : (document.title = "Ignite Timer");
  }, [minutes, seconds, activeCycle]);
  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}
