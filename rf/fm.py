#!/usr/bin/python

from subprocess import call
from argparse import ArgumentParser # pip install argparse
from time import sleep
from sys import exit

class FMHijacker:
   def __init__(self, song, freq, samplerate) -> None:
      self.song: str = song
      self.freq: str = freq
      self.samplerate: str = samplerate

   def test(self) -> None:
      while True:
         print(self.song, self.freq, self.samplerate)
         sleep(1)

   def hijack(self) -> None:
      while True:
         print(self.song, self.freq, self.samplerate)
         call(["sudo", "./pifm", self.song, self.freq, self.samplerate])

if __name__ == "__main__":
   parser = ArgumentParser(description='FMHijacker by NextrixVFX')
   parser.add_argument('song', help='Path to song')
   parser.add_argument('freq', help='Frequency of WAV Song')
   parser.add_argument('rate', help='Sample Rate of WAV Song')
   args = parser.parse_args()
   song, freq, rate = args.song, args.freq, args.rate
   fm = FMHijacker(song, freq, rate)
   
   try:
      fm.hijack()
   except KeyboardInterrupt:
      print("KeyboardInterrupt Recieved, Exitting!")
      exit(0)
