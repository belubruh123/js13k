/**
 * @module util/storage
 * Safe localStorage helpers for settings and run history.
 */
export const storage = {
  /** Get value */ get(key){ try{ return JSON.parse(localStorage.getItem('pps_'+key)); }catch{return null;} },
  /** Set value */ set(key,val){ localStorage.setItem('pps_'+key, JSON.stringify(val)); },
  /** Push to array */ push(key,item){ const a=this.get(key)||[]; a.push(item); this.set(key,a); }
};