import Wykop from '../lib/index';

const wykop = new Wykop();

it('should connect succesful', () => {
  wykop
    .request(['Entries', 'Hot'])
    .then((res: Response) => res.json())
    .then((data) => expect(data).not.toBeNull());
});
