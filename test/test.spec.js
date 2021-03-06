import { add, prop } from 'ramda'
import {
  createSelector,
  createKeySelector,
  createKeyedSelectorFactory
} from '../src'

const state = {
  users: {
    1: { id: 1, name: 'foo1' },
    2: { id: 2, name: 'foo2' },
    3: { id: 3, name: 'fooo3' },
    4: { id: 4, name: 'foooo4' },
    5: { id: 5, name: 'foo4' },
    6: { id: 6, name: 'foo5' },
    7: { id: 7, name: 'foo6' },
    8: { id: 8, name: 'foo7' },
    9: { id: 9, name: 'foo8' }
  }
}

const getUsers = prop('users')

describe('createSelector', () => {
  describe('computes dependant function', () => {
    test('dependencies can be grouped in an Array', () => {
      const selector = createSelector(
        [prop('a'), prop('b')],
        add
      )
      expect(selector({ a: 3, b: 4 })).toEqual(7)
    })

    test('dependencies do not have to be grouped in an Array', () => {
      const selector = createSelector(
        prop('a'),
        prop('b'),
        add
      )
      expect(selector({ a: 3, b: 4 })).toEqual(7)
    })
  })
})

describe('createKeyedSelectorFactory', () => {
  test('returns a factory of keyed-selectors with a shared cache', () => {
    const getUserFactory = createKeyedSelectorFactory(
      getUsers,
      (users, key) => users[key]
    )

    const getPropsFrom = jest.fn((s, { from }) => from)
    const getPropsTo = jest.fn((s, { to }) => to)
    const getUserFrom = getUserFactory(getPropsFrom)
    const getUserTo = getUserFactory(getPropsTo)

    expect(getUserFrom.getCache() instanceof Map).toBe(true)
    expect(getUserFrom.getCache().size).toBe(0)
    expect(getUserTo.getCache()).toBe(getUserFrom.getCache())

    expect(getPropsFrom.mock.calls.length).toBe(0)
    expect(getUserFrom.getCache().size).toBe(0)

    expect(getUserFrom(state, { from: 1 })).toBe(state.users[1])
    expect(getUserFrom.getCache().size).toBe(1)
    expect(getPropsFrom.mock.calls.length).toBe(2)
    expect(getUserFrom.recomputations()).toBe(1)
    expect(getUserTo.recomputations()).toBe(0)

    expect(getUserTo(state, { to: 1 })).toBe(state.users[1])
    expect(getUserTo.recomputations()).toBe(0)
    expect(getUserFrom.recomputations()).toBe(1)
    expect(getPropsTo.mock.calls.length).toBe(2)
    expect(getUserTo.recomputations()).toBe(0)
    expect(getUserFrom.getCache().size).toBe(1)
    expect(getUserTo.getCache().size).toBe(1)

    expect(getUserTo(state, { to: 2 })).toBe(state.users[2])
    expect(getUserTo.recomputations()).toBe(1)
    expect(getUserFrom.getCache().size).toBe(2)
    expect(getPropsTo.mock.calls.length).toBe(4)
  })
})

describe('keyed selectors', () => {
  let getFromProp, getToProp, getUserFrom, getUserTo, joinNames, getJoinedNames

  beforeEach(() => {
    getFromProp = createKeySelector((state, { from }) => from)
    getToProp = createKeySelector((state, { to }) => to)

    getUserFrom = createSelector(
      getFromProp,
      getUsers,
      prop
    )
    getUserTo = createSelector(
      getToProp,
      getUsers,
      prop
    )

    joinNames = jest.fn(
      ({ name: nameA }, { name: nameB }) => `${nameA}-${nameB}`
    )

    getJoinedNames = createSelector(
      [getUserFrom, getUserTo],
      joinNames
    )
  })

  describe('cache and recomputations', () => {
    test('it detects those selectors that its cache should be keyed', () => {
      const joinedOneTwo = getJoinedNames(state, { from: 1, to: 2 })
      expect(joinedOneTwo).toEqual('foo1-foo2')
      expect(joinNames.mock.calls.length).toBe(1)

      const joinedOneThree = getJoinedNames(state, { from: 1, to: 3 })
      expect(joinedOneThree).toEqual('foo1-fooo3')
      expect(joinNames.mock.calls.length).toBe(2)
      expect(getUserTo.recomputations()).toBe(2)
      expect(getUserTo.getCache().size).toBe(2)
      expect(getUserFrom.recomputations()).toBe(1)
      expect(getUserFrom.getCache().size).toBe(1)

      const joinedOneTwoAgain = getJoinedNames(state, { from: 1, to: 2 })
      expect(joinedOneTwoAgain).toBe(joinedOneTwo)
      expect(joinNames.mock.calls.length).toBe(2)
      expect(getUserTo.recomputations()).toBe(2)
      expect(getUserTo.getCache().size).toBe(2)
      expect(getUserFrom.recomputations()).toBe(1)
      expect(getUserFrom.getCache().size).toBe(1)

      const newState = {
        ...state,
        users: {
          ...state.users,
          newOne: {}
        }
      }

      const joinedOneThreeAgain = getJoinedNames(newState, { from: 1, to: 3 })
      expect(joinedOneThreeAgain).toBe(joinedOneThree)
      expect(joinNames.mock.calls.length).toBe(2)
      expect(getUserTo.recomputations()).toBe(3)
      expect(getUserTo.getCache().size).toBe(2)
      expect(getUserFrom.recomputations()).toBe(2)
      expect(getUserFrom.getCache().size).toBe(1)
      expect(getJoinedNames.recomputations()).toBe(2)
      expect(getJoinedNames.getCache().size).toBe(2)
    })
  })

  describe('usage: refCounts', () => {
    test('it cleans the cache when all users unsubscribe', () => {
      let s = state

      const [updateUsage1, stopUsage1] = getJoinedNames.use()
      let props1 = { from: 1, to: 2 }
      getJoinedNames(s, props1)
      updateUsage1(s, props1)

      const [updateUsage2, stopUsage2] = getJoinedNames.use()
      let props2 = { from: 1, to: 3 }
      getJoinedNames(s, props2)
      updateUsage2(s, props2)

      const [updateUsage3, stopUsage3] = getJoinedNames.use()
      let props3 = { from: 2, to: 4 }
      getJoinedNames(s, props3)
      updateUsage3(s, props3)

      s = {
        ...state,
        users: {
          ...state.users,
          newOne: {}
        }
      }

      getJoinedNames(s, props1)
      updateUsage1(s, props1)
      getJoinedNames(s, props2)
      updateUsage2(s, props2)
      getJoinedNames(s, props3)
      updateUsage3(s, props3)

      expect(getJoinedNames.getCache().size).toBe(3)
      expect(getUserTo.getCache().size).toBe(3)
      expect(getUserFrom.getCache().size).toBe(2)

      stopUsage1()
      expect(getJoinedNames.getCache().size).toBe(2)
      expect(getUserTo.getCache().size).toBe(2)
      expect(getUserFrom.getCache().size).toBe(2)

      stopUsage2()
      expect(getJoinedNames.getCache().size).toBe(1)
      expect(getUserTo.getCache().size).toBe(1)
      expect(getUserFrom.getCache().size).toBe(1)

      stopUsage3()
      expect(getJoinedNames.getCache().size).toBe(0)
      expect(getUserTo.getCache().size).toBe(0)
      expect(getUserFrom.getCache().size).toBe(0)
    })
  })
})
