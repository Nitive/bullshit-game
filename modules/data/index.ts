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
      color: '#d84e76',
      mistakes: [
        {
          id: 'derision',
          shortName: 'Высмеивание',
          fullName: 'Высмеивание аргумента или человека без опровержения самого аргумента',
          examples: [
            'Вы отрицаете очевидное, чтобы попрактиковаться в демагогии?',
            'Хватит клаунады, мы тут о серьёзных вещах говорим.',
          ],
        },
        {
          id: 'x-2',
          shortName: 'Обращение к силе',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-3',
          shortName: 'Соломенное чучело',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-4',
          shortName: 'Аппеляция к социальной неуспешности',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-5',
          shortName: 'Переход на личности',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-6',
          shortName: 'Отвлекающий манёвр',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-7',
          shortName: 'Наводящий вопрос',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-8',
          shortName: 'Двусмысленность',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-9',
          shortName: 'Высмеивание',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-2',
          shortName: 'Обращение к силе',
          fullName: '',
          examples: [],
        },
      ],
    },
    {
      color: '#ecb73b',
      mistakes: [
        {
          id: 'derision',
          shortName: 'Высмеивание',
          fullName: 'Высмеивание аргумента или человека без опровержения самого аргумента',
          examples: [
            'Вы отрицаете очевидное, чтобы попрактиковаться в демагогии?',
            'Хватит клаунады, мы тут о серьёзных вещах говорим.',
          ],
        },
        {
          id: 'x-2',
          shortName: 'Обращение к силе',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-3',
          shortName: 'Соломенное чучело',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-4',
          shortName: 'Аппеляция к социальной неуспешности',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-5',
          shortName: 'Переход на личности',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-6',
          shortName: 'Отвлекающий манёвр',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-7',
          shortName: 'Наводящий вопрос',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-8',
          shortName: 'Двусмысленность',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-9',
          shortName: 'Высмеивание',
          fullName: '',
          examples: [],
        },
        {
          id: 'x-2',
          shortName: 'Обращение к силе',
          fullName: '',
          examples: [],
        },
      ],
    },
  ],
}
