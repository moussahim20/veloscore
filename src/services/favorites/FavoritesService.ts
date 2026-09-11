export interface FavoriteItems {
  matches: string[];
  teams: string[];
  competitions: string[];
}

const STORAGE_KEY = 'veloscore_favorites';

export class FavoritesService {
  private static getStored(): FavoriteItems {
    if (typeof window === 'undefined') {
      return { matches: [], teams: [], competitions: [] };
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return { matches: [], teams: [], competitions: [] };
  }

  private static save(items: FavoriteItems) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent('veloscore_favorites_updated', { detail: items }));
    } catch {
      // storage full or disabled
    }
  }

  public static getFavorites(): FavoriteItems {
    return this.getStored();
  }

  public static isMatchFavorite(id: string): boolean {
    return this.getStored().matches.includes(id);
  }

  public static toggleMatchFavorite(id: string): boolean {
    const items = this.getStored();
    const index = items.matches.indexOf(id);
    let isFav = false;
    if (index >= 0) {
      items.matches.splice(index, 1);
      isFav = false;
    } else {
      items.matches.push(id);
      isFav = true;
    }
    this.save(items);
    return isFav;
  }

  public static isTeamFavorite(id: string): boolean {
    return this.getStored().teams.includes(id);
  }

  public static toggleTeamFavorite(id: string): boolean {
    const items = this.getStored();
    const index = items.teams.indexOf(id);
    let isFav = false;
    if (index >= 0) {
      items.teams.splice(index, 1);
      isFav = false;
    } else {
      items.teams.push(id);
      isFav = true;
    }
    this.save(items);
    return isFav;
  }

  public static isCompetitionFavorite(id: string): boolean {
    return this.getStored().competitions.includes(id);
  }

  public static toggleCompetitionFavorite(id: string): boolean {
    const items = this.getStored();
    const index = items.competitions.indexOf(id);
    let isFav = false;
    if (index >= 0) {
      items.competitions.splice(index, 1);
      isFav = false;
    } else {
      items.competitions.push(id);
      isFav = true;
    }
    this.save(items);
    return isFav;
  }
}
