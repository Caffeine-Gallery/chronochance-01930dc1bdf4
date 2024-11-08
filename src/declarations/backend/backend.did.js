export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'generateRandomTime' : IDL.Func([], [IDL.Nat], []),
    'getGameState' : IDL.Func(
        [],
        [
          IDL.Record({
            'isActive' : IDL.Bool,
            'highScore' : IDL.Nat,
            'currentScore' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'playerReaction' : IDL.Func([], [IDL.Text], []),
    'startGame' : IDL.Func([IDL.Nat], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
