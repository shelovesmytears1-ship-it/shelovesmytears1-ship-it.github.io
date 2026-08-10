/**
 * Case slug -> folder under the Overflow Portfolio root.
 *
 * The capture scripts normally shoot each case from its live `siteUrl`. When a
 * site has been upgraded locally but not pushed yet, pass `--local <root>` and
 * the mapped slugs are shot from these folders instead. Slugs that are absent
 * here (e.g. stepbystep) always keep their live URL.
 */
export const LOCAL_PATH = {
  archline: 'sites/ARCHLINE',
  denty: 'sites/Denty',
  dispersia: 'sites/dispersia-fashion',
  draft: 'sites/Draft',
  dzherelo: 'sites/Dzherelo',
  essence: 'sites/Essence',
  freshclean: 'sites/FreshClean',
  interspace: 'sites/INTERSPACE',
  kult: 'sites/KULT',
  lunea: 'sites/LUNEA',
  modulart: 'sites/ModulArt',
  orlov: 'sites/Orlov',
  prawnik: 'sites/Prawnik',
  prezfull: 'sites/Prezfull',
  smm: 'sites/Vanguard',
  touche: 'sites/Touche',
  wavemetrics: 'sites/Wavemetrics'
};
