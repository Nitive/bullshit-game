export interface IMistake {
  readonly id: string,
  readonly shortName: string,
  readonly fullName: string,
  readonly examples: string[],
}

export interface IMistakesGroup {
  readonly color: string,
  readonly mistakes: IMistake[],
}

export interface IAppData {
  mistakesGroups: IMistakesGroup[],
}

export const data: IAppData = {
  mistakesGroups: [
    {
      color: 'yellow',
      mistakes: [
        {
          id: 'haha',
          shortName: 'Высменивание',
          fullName: 'Высмеивание аргумента или человека без опровержения самого аргумента',
          examples: [
            'Вы отрицаете очевидное, чтобы попрактиковаться в демагогии?',
            'Хватит клаунады, мы тут о серьёзных вещах говорим.',
          ],
        },
      ],
    },
    {
      color: 'yellow',
      mistakes: [
        {
          id: 'haha-1',
          shortName: 'Высменивание 1',
          fullName: 'Высмеивание аргумента или человека без опровержения самого аргумента',
          examples: [
            'Вы отрицаете очевидное, чтобы попрактиковаться в демагогии?',
            'Хватит клаунады, мы тут о серьёзных вещах говорим.',
          ],
        },
      ],
    },
  ],
}


