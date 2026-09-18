/**
 * Do not edit directly, this file was auto-generated.
 */

/** 1% black — barely-there wash */
export const ColorAlphaBlack1: string;
/** 3% black — default hover wash */
export const ColorAlphaBlack3: string;
export const ColorAlphaBlack5: string;
export const ColorAlphaBlack10: string;
export const ColorAlphaBlack15: string;
export const ColorAlphaBlack20: string;
export const ColorAlphaBlack25: string;
export const ColorAlphaBlack30: string;
export const ColorAlphaBlack40: string;
export const ColorAlphaBlack50: string;
export const ColorAlphaBlack60: string;
export const ColorAlphaBlack70: string;
export const ColorAlphaBlack80: string;
export const ColorAlphaBlack90: string;
export const ColorAlphaBlack100: string;
export const ColorBrand50: string;
export const ColorBrand100: string;
export const ColorBrand200: string;
export const ColorBrand300: string;
export const ColorBrand400: string;
export const ColorBrand500: string;
export const ColorBrand600: string;
export const ColorBrand700: string;
export const ColorBrand800: string;
export const ColorBrand900: string;
export const ColorBrand950: string;
/** warm near-white card fill — product override */
export const ColorExtraCard: string;
/** Primary button fill — a lightened brand. Button-only gimmick: color.text.brand / color.icon.brand stay at 600 everywhere else. */
export const ColorButtonPrimaryBackgroundDefault: string;
export const ColorButtonPrimaryBackgroundHover: string;
export const ColorButtonPrimaryText: string;
export const ColorButtonPrimaryIcon: string;
/** Glass catch on the coloured primary surface — hand-tuned, not on the palette. */
export const ColorButtonPrimaryBorderDefault: string;
export const ColorButtonPrimaryBorderHover: string;
/** Full 1.5px white border on focus / active — high contrast on the brand fill (parallels color.button.secondary.border.active). */
export const ColorButtonPrimaryBorderActive: string;
/** Inner-shadow colour for the 'Viginette primary 2xs' effect style (hand-tuned). */
export const ColorButtonPrimaryShadowDefault: string;
export const ColorButtonPrimaryShadowHover: string;
/** Same glass surface as Card / StatButton — #fcfcfc, unchanged by state (hover swaps the shadow, not the fill). */
export const ColorButtonSecondaryBackgroundDefault: string;
export const ColorButtonSecondaryText: string;
export const ColorButtonSecondaryIcon: string;
/** White glass catch (top + left) at rest / hover. */
export const ColorButtonSecondaryBorderDefault: string;
/** Full 1.5px primary border on focus / active. */
export const ColorButtonSecondaryBorderActive: string;
/** Text-only button — same colour as the secondary label at rest; hover adds an underline. */
export const ColorButtonTertiaryTextDefault: string;
/** Hover→underline, active→this ('turns primary colour') + underline. */
export const ColorButtonTertiaryTextActive: string;
export const ColorButtonTertiaryIconDefault: string;
export const ColorButtonTertiaryIconActive: string;
export const ColorButtonDangerBackgroundDefault: string;
export const ColorButtonDangerBackgroundHover: string;
export const ColorButtonDangerText: string;
export const ColorButtonDisabledBackground: string;
export const ColorButtonDisabledText: string;
export const ColorCardBackgroundDefault: string;
/** Reserved — for the future interactive-card hover state (not used yet) */
export const ColorCardBackgroundHover: string;
/** The asymmetric glass catch (top + left, 1.5px, white). Widths + the inner-shadow are hand-tuned in the CSS, not tokens. */
export const ColorCardBorder: string;
/** Focused/active glass border — full 1.5px primary, replaces the white top-left catch. Shared by Card, StatButton, and other glass buttons. */
export const ColorCardBorderActive: string;
export const ColorBadgeNeutralGlow: string;
/** One step darker than glow — neutral has no hue to lean on, so the inner shadow needs the extra step to read as depth rather than just a flat gray smear. */
export const ColorBadgeNeutralShadow: string;
export const ColorBadgeNeutralText: string;
export const ColorBadgeBrandGlow: string;
/** One step darker than glow, same reasoning as neutral.shadow — brand kept the asymmetric pair rather than being flattened to match the other 4 tones. */
export const ColorBadgeBrandShadow: string;
export const ColorBadgeBrandText: string;
export const ColorBadgeSuccessGlow: string;
/** Same step as glow — unlike neutral/brand, success/warning/danger/warning-strong reuse one shade for both, since their own hue already carries enough depth without a darker second step. */
export const ColorBadgeSuccessShadow: string;
export const ColorBadgeSuccessText: string;
export const ColorBadgeWarningGlow: string;
export const ColorBadgeWarningShadow: string;
/** One step lighter than text.warning (amber.700) — deliberate primitive alias so the amber `warning` badge is clearly distinct from the orange `warning-strong` badge. Small contrast tradeoff (~3.2:1) accepted for level differentiation. */
export const ColorBadgeWarningText: string;
export const ColorBadgeWarningStrongGlow: string;
export const ColorBadgeWarningStrongShadow: string;
export const ColorBadgeWarningStrongText: string;
export const ColorBadgeDangerGlow: string;
export const ColorBadgeDangerShadow: string;
export const ColorBadgeDangerText: string;
export const ColorBadgeInfoBackground: string;
export const ColorBadgeInfoText: string;
/** zinc.100. Owner decided the header row only ever needs one flat color — no separate active/focused state — so this took over the value that had briefly been header.background.active; the original default (color.surface.subtle, zinc.50) was removed since it's no longer used anywhere. */
export const ColorTableHeaderBackgroundDefault: string;
export const ColorTableHeaderText: string;
/** Fixed from color.surface.default (#ffffff) — rows/cells sit directly on Table's own Card-replica surface (#fcfcfc via color.card.background.default), not as a separate white panel. TableCell itself is transparent; TableRow is what actually carries this fill. */
export const ColorTableRowBackgroundDefault: string;
export const ColorTableRowBackgroundSelected: string;
/** Focused row — mirrors row.background.default exactly (owner's call: the fill doesn't change on focus, only the border does — same restraint Input uses for its own focus state). Aliased to the token, not duplicated, so it can never drift from default. */
export const ColorTableRowBackgroundActive: string;
/** Deliberate primitive alias, one step paler than color.background.danger-subtle (rose.100) — owner's explicit choice for a low-contrast row wash, not the louder banner-style danger-subtle tone. */
export const ColorTableRowBackgroundDanger: string;
/** Deliberate primitive alias, one step paler than color.background.success-subtle (emerald.100) — same reasoning as row.background.danger. */
export const ColorTableRowBackgroundSuccess: string;
/** 1px focus ring around the whole row — the only visible signal for the active/focused state now that its background mirrors default. Same token Input uses for its own focus border. */
export const ColorTableRowBorderActive: string;
/** Inset shadow, not a fill — the row has no background by default, hover darkens via an inner-shadow wash instead of swapping a fill. Shared with scrollableArea.row.shadow.hover. */
export const ColorTableRowShadowHover: string;
export const ColorTableBorder: string;
export const ColorModalBackground: string;
export const ColorModalBorder: string;
export const ColorModalScrim: string;
/** Recessed/inset scroll track, same intent as other inset zones */
export const ColorScrollableAreaBackground: string;
/** Inner-shadow tint at the scroll edges. Was a raw #00000026 before the alpha-black primitive ramp existed — now a proper alias, same value (15%). */
export const ColorScrollableAreaShadow: string;
/** Inset shadow, not a fill — rows have no background by default. Shared with table.row.shadow.hover. */
export const ColorScrollableAreaRowShadowHover: string;
/** 1px inset border for keyboard focus — inset (box-shadow, not outline) to stay consistent with the row's own no-fill, inset-shadow-hover treatment instead of an outer glow. */
export const ColorScrollableAreaRowBorderFocus: string;
/** Permanent 1px bottom-only divider between rows in a list — every state (default/hover/focus), unlike hover/focus which only apply on interaction. Owner changed this from border.subtle (zinc.100, "faint separators") to border.default (zinc.200, "inputs, cards, dividers") directly in Figma — a plain divider apparently read as too faint at subtle. CSS: box-shadow inset (layout-neutral, stacks with the focus ring as a second shadow layer). Figma: a real per-side stroke (strokeBottomWeight 1, others 0, INSIDE align, strokesIncludedInLayout false) — NOT an effect. An INNER_SHADOW effect on this frame (which has no fill) was confirmed to corrupt Figma's own text rendering for this file's variable-font weight; a stroke on the same no-fill frame does not. See docs/components/Row.md and HANDOFF.md §6. */
export const ColorScrollableAreaRowBorderDivider: string;
/** zinc.100, "wells, code blocks, inset track" — literally the inset-track description this token already carries, reused verbatim for the off-state track. */
export const ColorSwitchTrackOff: string;
/** brand.600, same token Button primary/selected-state uses. */
export const ColorSwitchTrackOn: string;
export const ColorSwitchTrackOnHover: string;
export const ColorSwitchTrackDisabled: string;
/** Always a plain white circle regardless of track state — the track color alone carries on/off/disabled. */
export const ColorSwitchThumb: string;
export const ColorCheckboxBackgroundOff: string;
export const ColorCheckboxBackgroundOn: string;
export const ColorCheckboxBackgroundOnHover: string;
export const ColorCheckboxBackgroundDisabled: string;
export const ColorCheckboxBorderOff: string;
export const ColorCheckboxBorderOffHover: string;
/** Same value as background.disabled (zinc.100) — a disabled checkbox reads as one flat muted shape, no separate border needed to stand out. */
export const ColorCheckboxBorderDisabled: string;
/** Added when Checkbox adopted a real focus variant (the previous 3-state default/hover/disabled set never modeled one) — same token Input/TableRow use for their own focus border. */
export const ColorCheckboxBorderFocus: string;
/** The checkmark (checked) / dash (indeterminate) glyph — white against the brand fill. Was a flat `checkbox.icon` leaf before React needed a disabled variant; the Figma master (4182:3616) still binds its glyph vectors to the old flat `color/checkbox/icon` name for every state, disabled included — a real Figma↔code drift, not fixed here (bridge is read-only for this task). Worth a follow-up: rename the Figma variable to `color/checkbox/icon/default` and add a sibling `color/checkbox/icon/disabled` bound onto the disabled+checked/indeterminate master variants. */
export const ColorCheckboxIconDefault: string;
/** Same restraint as `radio.dot.disabled` — a disabled control's glyph reads as muted gray, not a bright white mark on a pale gray fill (which would be nearly invisible). Not yet reflected in the Figma master, see `default`'s note. */
export const ColorCheckboxIconDisabled: string;
/** Radio keeps a plain white fill in every state, checked included — unlike Checkbox, which fills solid. The dot (see below) is what signals checked, not the fill. */
export const ColorRadioBackground: string;
export const ColorRadioBorderOff: string;
export const ColorRadioBorderOffHover: string;
export const ColorRadioBorderOn: string;
export const ColorRadioBorderOnHover: string;
export const ColorRadioBorderDisabled: string;
export const ColorRadioDotOn: string;
export const ColorRadioDotDisabled: string;
export const ColorInputBackgroundDefault: string;
export const ColorInputBackgroundDisabled: string;
export const ColorInputBorderDefault: string;
export const ColorInputBorderHover: string;
export const ColorInputBorderFocus: string;
export const ColorInputBorderError: string;
export const ColorInputBorderDisabled: string;
export const ColorInputTextDefault: string;
export const ColorInputTextPlaceholder: string;
export const ColorInputTextDisabled: string;
/** Leading/trailing icon color — always subtle, doesn't change with border state (hover/focus/error don't recolor it). */
export const ColorInputIcon: string;
/** Prepend/append text color (e.g. a fixed unit or protocol prefix inside the field) — a subtle, non-editable annotation next to the value, not the value's own text color. */
export const ColorInputAffix: string;
export const ColorLabelDefault: string;
export const ColorLabelSubtle: string;
export const ColorLabelMuted: string;
export const ColorLabelBrand: string;
export const ColorLabelSuccess: string;
export const ColorLabelWarning: string;
export const ColorLabelDanger: string;
/** The headline above the field, at rest — matches Row's own heading color (a field label reads as a subheading, not a page heading). */
export const ColorFormFieldLabelDefault: string;
export const ColorFormFieldLabelPrimary: string;
export const ColorFormFieldLabelError: string;
export const ColorHelperTextIconPrimary: string;
export const ColorHelperTextIconError: string;
export const ColorHelperTextTextPrimary: string;
export const ColorHelperTextTextError: string;
/** zinc.100 — the recessed track the pill items sit in. */
export const ColorSegmentedControlTrackBackground: string;
export const ColorSegmentedControlItemTextDefault: string;
export const ColorSegmentedControlItemTextHover: string;
export const ColorSegmentedControlItemTextDisabled: string;
/** Same alpha-black wash MenuRow/Row/TableRow already use for hover — a flat background here (not an inset shadow), since an unselected item has no fill of its own to layer over. */
export const ColorSegmentedControlItemBackgroundHover: string;
export const ColorSegmentedControlItemXsDefaultFill: string;
export const ColorSegmentedControlItemXsDefaultBorder: string;
export const ColorSegmentedControlItemXsDefaultInnerShadow: string;
export const ColorSegmentedControlItemXsDefaultOverlay: string;
export const ColorSegmentedControlItemXsHoverFill: string;
export const ColorSegmentedControlItemXsHoverBorder: string;
export const ColorSegmentedControlItemXsHoverInnerShadow: string;
export const ColorSegmentedControlItemXsHoverOverlay: string;
/** The gray track's own 0.5px frame — plain semantic, no tone variation (the track is always neutral). */
export const ColorProgressBarTrackBorder: string;
/** White edge highlight, not tone-colored — the same glass-catch token Card/Modal use, reused here rather than inventing a white primitive alias. */
export const ColorProgressBarFillBorder: string;
/** Flat neutral shadow, not tone-colored — replaces the earlier per-tone hue.700 shadow. */
export const ColorProgressBarFillShadow: string;
/** One step lighter than the shared color.background.brand.default (600) — ProgressBar's own main color now diverges from that semantic token on purpose, so lightening it here never affects Button/Badge/etc. */
export const ColorProgressBarBrandFill: string;
/** Kept at 400 (not shifted down with fill) — owner's explicit preference for a very subtle fill/stripe contrast, tighter than the original 2-step gap. */
export const ColorProgressBarBrandStripe: string;
export const ColorProgressBarSuccessFill: string;
export const ColorProgressBarSuccessStripe: string;
/** Owner's correction — the 500-600->400-500 ramp shift briefly landed this at amber.400, one step below the shared color.background.warning (amber.500); owner wanted warning's fill to stay at 500, unlike the other 3 tones which did shift down a step. */
export const ColorProgressBarWarningFill: string;
/** One step below fill (500), same relative gap the other 3 tones have between their own fill and stripe — the earlier 'same as fill' note no longer applies now that fill moved back to 500. */
export const ColorProgressBarWarningStripe: string;
export const ColorProgressBarDangerFill: string;
export const ColorProgressBarDangerStripe: string;
export const ColorSidebarIconDefault: string;
export const ColorSidebarTextDefault: string;
export const ColorSidebarPanelBackground: string;
export const ColorSidebarPanelInnerShadow: string;
export const ColorSidebarBrandFill: string;
export const ColorSidebarBrandAccent: string;
export const ColorSidebarSuccessFill: string;
export const ColorSidebarSuccessAccent: string;
export const ColorSidebarDangerFill: string;
export const ColorSidebarDangerAccent: string;
export const ColorSidebarNavItemActiveFill: string;
export const ColorSidebarNavItemActiveOverlay: string;
export const ColorSidebarNavItemActiveBorder: string;
export const ColorSidebarNavItemActiveInnerShadow: string;
/** Deliberately simpler than active — a flat wash with no border/inner-shadow/overlay, so hover reads as a lighter, transient touch compared to the fuller active recipe above. */
export const ColorSidebarNavItemHoverFill: string;
/** Owner's explicit call: the logo stays pure white on the sidebar regardless of theme — not an alias into the zinc ramp like every other sidebar token above, since this one is never meant to soften or recede. Was bound to a raw color.zinc.100 in Figma before this fix (an off-white, not the intended pure white). */
export const ColorSidebarLogoMark: string;
/** Same reasoning as mark, for the adjacent wordmark text — was bound to color.zinc.200 in Figma, inconsistent with the mark's own (also-wrong) near-white; both now resolve to the one correct value. */
export const ColorSidebarLogoWordmark: string;
/** Completed stage points + the connecting lines between them, and the current stage's own point fill. Adopted from the owner's pre-token 'Progress bar' component (4182:3097, renamed TableProgressStages) — was bound to the old shadcn-colors 'primary/primary'. */
export const ColorTableProgressStagesFilled: string;
/** Pending (not-yet-reached) stage points + lines. Was 'shadcn colors/general/actual muted' — same zinc.100 value, now a real semantic alias. */
export const ColorTableProgressStagesUnfilled: string;
/** The soft halo stroke around the current/active stage's point only — every other point/line is a flat fill with no stroke. Was 'primary/bg' (a raw light-indigo shadcn variable); this system's own equivalent 'soft brand tint' token is background.brand-subtle, the same one Badge's brand tone uses. */
export const ColorTableProgressStagesRing: string;
/** The one component that stays dark regardless of theme — a tooltip needs contrast against whatever's underneath, light or dark page alike. */
export const ColorTooltipBackground: string;
export const ColorTooltipText: string;
/** The standalone Divider atom's own line color. Distinct from LabelGroup's internal divider, which deliberately stays on color.text.subtle as fixed chrome — not unified, since that one predates this token and isn't worth a breaking rebind for a coincidental match. */
export const ColorDividerLine: string;
/** A sensible static default — real usage typically recolors it via context (the same way Button's own built-in spinner adopts each variant's icon color), same restraint as an inline icon. */
export const ColorSpinnerIcon: string;
/** An earlier, clickable crumb. */
export const ColorBreadcrumbTextDefault: string;
export const ColorBreadcrumbTextHover: string;
/** The last crumb — the current page, not a link. */
export const ColorBreadcrumbTextCurrent: string;
/** An optional brand-colored crumb — for calling out one segment of the trail (e.g. the entity type), independent of which crumb is current. */
export const ColorBreadcrumbTextPrimary: string;
/** The separator glyph between crumbs. */
export const ColorBreadcrumbIcon: string;
/** Neutral placeholder fill behind initials — not per-user hashed color, a static reference can't model that. */
export const ColorAvatarBackground: string;
/** The initials. */
export const ColorAvatarText: string;
/** The ring around the status dot and the action badge — separates them visually from the avatar image underneath, same idea as a real UI's cutout. */
export const ColorAvatarRing: string;
export const ColorAvatarStatusOnline: string;
export const ColorAvatarStatusOffline: string;
export const ColorAvatarActionAdd: string;
export const ColorAvatarActionDelete: string;
/** The add/delete glyph inside the action badge — white against either solid fill. */
export const ColorAvatarActionIcon: string;
export const ColorWhite: string;
export const ColorBlack: string;
export const ColorSlate50: string;
export const ColorSlate100: string;
export const ColorSlate200: string;
export const ColorSlate300: string;
export const ColorSlate400: string;
export const ColorSlate500: string;
export const ColorSlate600: string;
export const ColorSlate700: string;
export const ColorSlate800: string;
export const ColorSlate900: string;
export const ColorSlate950: string;
export const ColorGray50: string;
export const ColorGray100: string;
export const ColorGray200: string;
export const ColorGray300: string;
export const ColorGray400: string;
export const ColorGray500: string;
export const ColorGray600: string;
export const ColorGray700: string;
export const ColorGray800: string;
export const ColorGray900: string;
export const ColorGray950: string;
export const ColorZinc50: string;
export const ColorZinc100: string;
export const ColorZinc200: string;
export const ColorZinc300: string;
export const ColorZinc400: string;
export const ColorZinc500: string;
export const ColorZinc600: string;
export const ColorZinc700: string;
export const ColorZinc800: string;
export const ColorZinc900: string;
export const ColorZinc950: string;
export const ColorNeutral50: string;
export const ColorNeutral100: string;
export const ColorNeutral200: string;
export const ColorNeutral300: string;
export const ColorNeutral400: string;
export const ColorNeutral500: string;
export const ColorNeutral600: string;
export const ColorNeutral700: string;
export const ColorNeutral800: string;
export const ColorNeutral900: string;
export const ColorNeutral950: string;
export const ColorStone50: string;
export const ColorStone100: string;
export const ColorStone200: string;
export const ColorStone300: string;
export const ColorStone400: string;
export const ColorStone500: string;
export const ColorStone600: string;
export const ColorStone700: string;
export const ColorStone800: string;
export const ColorStone900: string;
export const ColorStone950: string;
export const ColorRed50: string;
export const ColorRed100: string;
export const ColorRed200: string;
export const ColorRed300: string;
export const ColorRed400: string;
export const ColorRed500: string;
export const ColorRed600: string;
export const ColorRed700: string;
export const ColorRed800: string;
export const ColorRed900: string;
export const ColorRed950: string;
export const ColorOrange50: string;
export const ColorOrange100: string;
export const ColorOrange200: string;
export const ColorOrange300: string;
export const ColorOrange400: string;
export const ColorOrange500: string;
export const ColorOrange600: string;
export const ColorOrange700: string;
export const ColorOrange800: string;
export const ColorOrange900: string;
export const ColorOrange950: string;
export const ColorAmber50: string;
export const ColorAmber100: string;
export const ColorAmber200: string;
export const ColorAmber300: string;
export const ColorAmber400: string;
export const ColorAmber500: string;
export const ColorAmber600: string;
export const ColorAmber700: string;
export const ColorAmber800: string;
export const ColorAmber900: string;
export const ColorAmber950: string;
export const ColorYellow50: string;
export const ColorYellow100: string;
export const ColorYellow200: string;
export const ColorYellow300: string;
export const ColorYellow400: string;
export const ColorYellow500: string;
export const ColorYellow600: string;
export const ColorYellow700: string;
export const ColorYellow800: string;
export const ColorYellow900: string;
export const ColorYellow950: string;
export const ColorLime50: string;
export const ColorLime100: string;
export const ColorLime200: string;
export const ColorLime300: string;
export const ColorLime400: string;
export const ColorLime500: string;
export const ColorLime600: string;
export const ColorLime700: string;
export const ColorLime800: string;
export const ColorLime900: string;
export const ColorLime950: string;
export const ColorGreen50: string;
export const ColorGreen100: string;
export const ColorGreen200: string;
export const ColorGreen300: string;
export const ColorGreen400: string;
export const ColorGreen500: string;
export const ColorGreen600: string;
export const ColorGreen700: string;
export const ColorGreen800: string;
export const ColorGreen900: string;
export const ColorGreen950: string;
export const ColorEmerald50: string;
export const ColorEmerald100: string;
export const ColorEmerald200: string;
export const ColorEmerald300: string;
export const ColorEmerald400: string;
export const ColorEmerald500: string;
export const ColorEmerald600: string;
export const ColorEmerald700: string;
export const ColorEmerald800: string;
export const ColorEmerald900: string;
export const ColorEmerald950: string;
export const ColorTeal50: string;
export const ColorTeal100: string;
export const ColorTeal200: string;
export const ColorTeal300: string;
export const ColorTeal400: string;
export const ColorTeal500: string;
export const ColorTeal600: string;
export const ColorTeal700: string;
export const ColorTeal800: string;
export const ColorTeal900: string;
export const ColorTeal950: string;
export const ColorCyan50: string;
export const ColorCyan100: string;
export const ColorCyan200: string;
export const ColorCyan300: string;
export const ColorCyan400: string;
export const ColorCyan500: string;
export const ColorCyan600: string;
export const ColorCyan700: string;
export const ColorCyan800: string;
export const ColorCyan900: string;
export const ColorCyan950: string;
export const ColorSky50: string;
export const ColorSky100: string;
export const ColorSky200: string;
export const ColorSky300: string;
export const ColorSky400: string;
export const ColorSky500: string;
export const ColorSky600: string;
export const ColorSky700: string;
export const ColorSky800: string;
export const ColorSky900: string;
export const ColorSky950: string;
export const ColorBlue50: string;
export const ColorBlue100: string;
export const ColorBlue200: string;
export const ColorBlue300: string;
export const ColorBlue400: string;
export const ColorBlue500: string;
export const ColorBlue600: string;
export const ColorBlue700: string;
export const ColorBlue800: string;
export const ColorBlue900: string;
export const ColorBlue950: string;
export const ColorIndigo50: string;
export const ColorIndigo100: string;
export const ColorIndigo200: string;
export const ColorIndigo300: string;
export const ColorIndigo400: string;
export const ColorIndigo500: string;
export const ColorIndigo600: string;
export const ColorIndigo700: string;
export const ColorIndigo800: string;
export const ColorIndigo900: string;
export const ColorIndigo950: string;
export const ColorViolet50: string;
export const ColorViolet100: string;
export const ColorViolet200: string;
export const ColorViolet300: string;
export const ColorViolet400: string;
export const ColorViolet500: string;
export const ColorViolet600: string;
export const ColorViolet700: string;
export const ColorViolet800: string;
export const ColorViolet900: string;
export const ColorViolet950: string;
export const ColorPurple50: string;
export const ColorPurple100: string;
export const ColorPurple200: string;
export const ColorPurple300: string;
export const ColorPurple400: string;
export const ColorPurple500: string;
export const ColorPurple600: string;
export const ColorPurple700: string;
export const ColorPurple800: string;
export const ColorPurple900: string;
export const ColorPurple950: string;
export const ColorFuchsia50: string;
export const ColorFuchsia100: string;
export const ColorFuchsia200: string;
export const ColorFuchsia300: string;
export const ColorFuchsia400: string;
export const ColorFuchsia500: string;
export const ColorFuchsia600: string;
export const ColorFuchsia700: string;
export const ColorFuchsia800: string;
export const ColorFuchsia900: string;
export const ColorFuchsia950: string;
export const ColorPink50: string;
export const ColorPink100: string;
export const ColorPink200: string;
export const ColorPink300: string;
export const ColorPink400: string;
export const ColorPink500: string;
export const ColorPink600: string;
export const ColorPink700: string;
export const ColorPink800: string;
export const ColorPink900: string;
export const ColorPink950: string;
export const ColorRose50: string;
export const ColorRose100: string;
export const ColorRose200: string;
export const ColorRose300: string;
export const ColorRose400: string;
export const ColorRose500: string;
export const ColorRose600: string;
export const ColorRose700: string;
export const ColorRose800: string;
export const ColorRose900: string;
export const ColorRose950: string;
/** Page / app canvas */
export const ColorBackgroundDefault: string;
/** Inset zones, striped rows, panels flush with the page */
export const ColorBackgroundSubtle: string;
/** A visibly deeper recessed fill than subtle — the AppShell content-slot backdrop the screen sits on */
export const ColorBackgroundMuted: string;
/** High-contrast fills: tooltips, inverse callouts */
export const ColorBackgroundEmphasis: string;
/** Disabled control fill */
export const ColorBackgroundDisabled: string;
/** Modal / drawer scrim — the darkener behind a centered modal. Pure black at 40% (was a zinc-950 tint at ~70%; lightened + de-tinted so the interface stays readable behind the modal). `color.modal.scrim` aliases this. */
export const ColorBackgroundOverlay: string;
/** Neutral hover/press wash — layers on top of whatever's underneath instead of replacing it (row hover, list-item hover, etc.), unlike background.subtle which is an opaque swap */
export const ColorBackgroundOverlaySubtle: string;
/** Primary button, active nav item, selected state */
export const ColorBackgroundBrandDefault: string;
export const ColorBackgroundBrandHover: string;
export const ColorBackgroundBrandActive: string;
/** Tinted brand fill: selected row, info banner */
export const ColorBackgroundBrandSubtle: string;
/** Destructive button */
export const ColorBackgroundDangerDefault: string;
export const ColorBackgroundDangerHover: string;
/** Error banner / callout fill */
export const ColorBackgroundDangerSubtle: string;
/** Solid success badge / button */
export const ColorBackgroundSuccess: string;
/** Success banner fill */
export const ColorBackgroundSuccessSubtle: string;
/** Solid warning badge */
export const ColorBackgroundWarning: string;
/** Warning banner fill */
export const ColorBackgroundWarningSubtle: string;
/** Orange alert accent — the warning pill/icon in the alert system, distinct from amber warning */
export const ColorBackgroundWarningStrong: string;
/** Orange warning/attention pill fill (matches the other -subtle tones at 100) */
export const ColorBackgroundWarningStrongSubtle: string;
/** Solid info badge */
export const ColorBackgroundInfo: string;
/** Info banner fill */
export const ColorBackgroundInfoSubtle: string;
/** Panel, modal, menu, sheet */
export const ColorSurfaceDefault: string;
/** Card fill — warm near-white #fcfcfc (product override, not on the Tailwind scale) */
export const ColorSurfaceCard: string;
/** Nested surface, table header row */
export const ColorSurfaceSubtle: string;
/** Surface carrying an elevation shadow: popover, dropdown */
export const ColorSurfaceRaised: string;
/** Wells, code blocks, inset track */
export const ColorSurfaceSunken: string;
/** The one surface that stays dark regardless of theme — Tooltip's fill. */
export const ColorSurfaceInverse: string;
/** Main headings — h1/h2, page titles */
export const ColorTextDefault: string;
/** Subheadings — h3–h6, section/card titles */
export const ColorTextStrong: string;
/** Body text — the default reading colour for paragraphs and UI copy */
export const ColorTextSubtle: string;
/** Muted / de-emphasised text — hints, placeholders, timestamps, captions */
export const ColorTextMuted: string;
/** Disabled control text */
export const ColorTextDisabled: string;
/** Links, brand-colored labels */
export const ColorTextBrand: string;
/** Validation errors, destructive labels */
export const ColorTextDanger: string;
export const ColorTextSuccess: string;
export const ColorTextWarning: string;
/** Orange warning-pill text */
export const ColorTextWarningStrong: string;
/** Text that must read as the same accent as a solid brand fill nearby (a bar, a dot) — aliases background.brand.default itself, not a hand-picked shade, so the two can never drift apart. NOT for text on a light/subtle background — text.brand (700) stays there; this is ~100 lighter and won't clear AA on brand-subtle. */
export const ColorTextBrandSolid: string;
/** Text matching a solid success fill nearby — see brand-solid. */
export const ColorTextSuccessSolid: string;
/** Text matching a solid (amber) warning fill nearby — see brand-solid. Not warning-strong (orange) — that hue is scoped to the alert-pill system only. */
export const ColorTextWarningSolid: string;
/** Text matching a solid danger fill nearby — see brand-solid. */
export const ColorTextDangerSolid: string;
export const ColorTextInfo: string;
/** Text on color.background.brand* */
export const ColorTextOnBrand: string;
/** Text on color.background.emphasis */
export const ColorTextOnEmphasis: string;
/** Text on color.background.danger* */
export const ColorTextOnDanger: string;
/** Text on color.background.success — added alongside on-brand/on-danger for SegmentedControlItem's tone fills; same white-on-solid-mid-tone pattern. */
export const ColorTextOnSuccess: string;
/** Text on color.surface.inverse (Tooltip). */
export const ColorTextOnInverse: string;
/** Inputs, cards, dividers */
export const ColorBorderDefault: string;
/** Faint separators */
export const ColorBorderSubtle: string;
/** Emphasized / hover borders */
export const ColorBorderStrong: string;
/** Selected input, active tab */
export const ColorBorderBrand: string;
/** Invalid input */
export const ColorBorderDanger: string;
/** Focus ring */
export const ColorBorderFocus: string;
/** White edge highlight for glass / raised surfaces (asymmetric top-left catch) */
export const ColorBorderHighlight: string;
/** Glass edge highlight when the surface is focused/active — a full 1.5px primary border that replaces the white top-left catch */
export const ColorBorderHighlightActive: string;
/** Standalone UI icons */
export const ColorIconDefault: string;
/** Decorative / secondary icons */
export const ColorIconSubtle: string;
export const ColorIconBrand: string;
export const ColorIconDanger: string;
export const ColorIconSuccess: string;
/** Orange warning-pill icon */
export const ColorIconWarningStrong: string;
/** Icon on a brand fill */
export const ColorIconOnBrand: string;
/** Icon on color.background.emphasis */
export const ColorIconOnEmphasis: string;
/** Categorical series 1 — placeholder palette, revisit with the real chart component. Migrated from brand.500 to match Figma's lighter chart ramp. */
export const ColorChart1: string;
/** Not migrated to cyan.400 — failed the dataviz skill's lightness-band check at .400 (L 0.797, above the 0.77 ceiling). */
export const ColorChart2: string;
/** Not migrated to amber.400 — failed the lightness-band check at .400 (L 0.837). */
export const ColorChart3: string;
/** Not migrated to emerald.400/500 — .400 failed the lightness-band check (L 0.773); .500 cleared it but its pair with rose.500 fell to CVD ΔE 5.6, under the 6.0 floor. .600 clears both (ΔE 8.3). */
export const ColorChart4: string;
export const ColorChart5: string;
/** Not migrated to violet.400 — passed alone, but paired with sky.400 fell to CVD ΔE 5.2. .500 restores separation. */
export const ColorChart6: string;
/** Migrated from sky.600 to match Figma's lighter chart ramp — passes paired with violet.500. */
export const ColorChart7: string;
/** Not migrated to lime.400 — failed the lightness-band check at .400 (L 0.849, the worst offender). */
export const ColorChart8: string;
/** indigo.600 — reuses the existing brand primitive rather than a separate value */
export const ColorCategoryBrandText: string;
export const ColorCategoryBrandBackground: string;
/** brand.600 desaturated -0.20 in HSL (H 243, L 59 held; S 75->55). Contrast vs. white icon: 5.35:1. */
export const ColorCategoryBrandBackgroundMuted: string;
/** Not .700 — fails the chroma floor at that depth (reads gray), same issue as cyan. Contrast vs. own-100 is 3.3:1 — accepted per the always-a-label mitigation on the group description. */
export const ColorCategoryTealText: string;
export const ColorCategoryTealBackground: string;
/** teal.600 desaturated -0.20 in HSL (H 175, L 32 held; S 84->64). Contrast vs. white icon: 4.53:1. */
export const ColorCategoryTealBackgroundMuted: string;
/** 700, not 600 — .600 doesn't clear 4.5:1 contrast. */
export const ColorCategoryRoseText: string;
export const ColorCategoryRoseBackground: string;
/** rose.700 desaturated -0.20 in HSL (H 345, L 41 held; S 83->63). Contrast vs. white icon: 6.84:1. */
export const ColorCategoryRoseBackgroundMuted: string;
/** Not .700 — turns muddy-olive, indistinguishable from emerald under the stricter all-pairs test that was relaxed for this set; still the right shade under adjacent-only since lime and emerald are kept non-adjacent. Contrast vs. own-100 is 2.9:1 at .600 — accepted per the always-a-label mitigation. */
export const ColorCategoryLimeText: string;
export const ColorCategoryLimeBackground: string;
/** lime.600 desaturated -0.20 in HSL (H 85, L 35 held; S 85->65). Contrast vs. white icon: 3.74:1 — the weakest of the 10, still clears the 3:1 UI-graphics floor; same always-a-label mitigation as .text above. */
export const ColorCategoryLimeBackgroundMuted: string;
/** 700, not 600 — .600 doesn't clear 4.5:1 contrast. */
export const ColorCategoryFuchsiaText: string;
export const ColorCategoryFuchsiaBackground: string;
/** fuchsia.700 desaturated -0.20 in HSL (H 295, L 40 held; S 72->52). Contrast vs. white icon: 6.76:1. */
export const ColorCategoryFuchsiaBackgroundMuted: string;
/** Not .700 — fails the chroma floor (reads gray) at that depth. Contrast vs. own-100 is 3.3:1 — accepted per the always-a-label mitigation. */
export const ColorCategoryCyanText: string;
export const ColorCategoryCyanBackground: string;
/** cyan.600 desaturated -0.20 in HSL (H 192, L 36 held; S 91->71). Contrast vs. white icon: 4.25:1. */
export const ColorCategoryCyanBackgroundMuted: string;
/** 700, not 600 — .600 doesn't clear 4.5:1 contrast. Kept non-adjacent to rose (its nearest Tailwind neighbor, ΔE 4.6 at dark shades — would fail right next to it). */
export const ColorCategoryPinkText: string;
export const ColorCategoryPinkBackground: string;
/** pink.700 desaturated -0.20 in HSL (H 335, L 42 held; S 78->58). Contrast vs. white icon: 6.50:1. */
export const ColorCategoryPinkBackgroundMuted: string;
/** Kept non-adjacent to brand/indigo (its nearest neighbor, ΔE as low as 0.9 under some CVD types at .700 — would fail right next to it). */
export const ColorCategoryVioletText: string;
export const ColorCategoryVioletBackground: string;
/** violet.600 desaturated -0.20 in HSL (H 262, L 58 held; S 83->63). Contrast vs. white icon: 5.17:1. */
export const ColorCategoryVioletBackgroundMuted: string;
/** 700, not 600 — .600 doesn't clear 4.5:1 contrast. */
export const ColorCategoryEmeraldText: string;
export const ColorCategoryEmeraldBackground: string;
/** emerald.700 desaturated -0.20 in HSL (H 163, L 24 held; S 94->74). Contrast vs. white icon: 6.42:1. */
export const ColorCategoryEmeraldBackgroundMuted: string;
/** Kept non-adjacent to brand/indigo (its nearest neighbor — the two are easily confused at matching shades). */
export const ColorCategoryBlueText: string;
export const ColorCategoryBlueBackground: string;
/** blue.700 desaturated -0.20 in HSL (H 224, L 48 held; S 76->56). Contrast vs. white icon: 6.25:1. */
export const ColorCategoryBlueBackgroundMuted: string;
export const RadiusCard: string;
export const RadiusPage: string;
export const RadiusModal: string;
export const RadiusTable: string;
export const RadiusPopover: string;
/** 6 — 1440 migration: sizes unified across variant, one radius per size now (was per-variant-per-size). Renamed from 2sm — xs reads as a logical bottom step of the sm/md/lg/xl/2xl scale, matching how 2xl reads as the logical top step. */
export const RadiusButtonXs: string;
/** 6 */
export const RadiusButtonSm: string;
/** 8 */
export const RadiusButtonMd: string;
/** 8 */
export const RadiusButtonLg: string;
/** 8 */
export const RadiusButtonXl: string;
/** 12 — primary only */
export const RadiusButton2xl: string;
export const RadiusInput: string;
/** 6 — small badge */
export const RadiusBadgeSm: string;
/** 8 — medium badge */
export const RadiusBadgeMd: string;
/** 8 — large badge */
export const RadiusBadgeLg: string;
/** 4, flat across all sizes — a checkbox's corner rounding doesn't scale with its box size, same reasoning as radius.input staying flat across Input's sizes. */
export const RadiusCheckbox: string;
/** Pill track + circular thumb at every size — a switch is always fully rounded, no size-dependent step needed. */
export const RadiusSwitch: string;
/** Circular at every size, same reasoning as radius.switch — no size-dependent corner step. Was never scaffolded when Radio's other component colour tokens were added; added now while building Radio's React port (confirmed via the Figma master, 10222:14006 — cornerRadius 9999 on all 18 variants). */
export const RadiusRadio: string;
/** 6 — mirrors radius.button.sm; the track and its items share this radius (a small inset gap between them reads fine without stepping the track's radius up). */
export const RadiusSegmentedControlSm: string;
/** 8 — mirrors radius.button.md/lg. */
export const RadiusSegmentedControlMd: string;
/** 8 — mirrors radius.button.md/lg. */
export const RadiusSegmentedControlLg: string;
/** 6, flat — same small-chrome radius Badge/Button-sm use, at every size (a tooltip has no size-dependent step). */
export const RadiusTooltip: string;
/** Always a full circle, at every size — same reasoning as radius.switch/radio. */
export const RadiusAvatar: string;
/** 4 */
export const RadiusSidebarSectionTop: string;
/** 24 */
export const RadiusSidebarSectionDeep: string;
export const RadiusNone: string;
/** 2px */
export const RadiusXs: string;
/** 4px */
export const RadiusSm: string;
/** 6px */
export const RadiusMd: string;
/** 8px */
export const RadiusLg: string;
/** 12px */
export const RadiusXl: string;
/** 16px */
export const Radius2xl: string;
/** 20px */
export const Radius3xl: string;
/** 24px — AppShell/Page's own content-viewport corner */
export const Radius4xl: string;
/** 32px */
export const Radius5xl: string;
/** pills, avatars, dots */
export const RadiusFull: string;
/** 12px — outermost content card in a carded layout (1440 migration: was radius.2xl/16px) */
export const RadiusContainer: string;
/** 24px — AppShell/Page's own content viewport, distinct from a Card's container radius */
export const RadiusPageContainer: string;
/** 12px — nested card, section, menu, popover, sheet */
export const RadiusPanel: string;
/** 8px — button, input, select, textarea */
export const RadiusControl: string;
/** 6px — badge, tag, checkbox, small toggle */
export const RadiusChip: string;
/** pill button, avatar, status dot */
export const RadiusPill: string;
/** 28px, RAW — not aliased to space/*, which jumps 24→32 with nothing at 28. A control's height is a sizing concern, not a spacing one. Matches Button's own sm/xs height exactly, so a Button and a same-size-step control align in a toolbar. This is the size/control/* token flagged as a TODO in Button.md/HANDOFF. Input no longer uses this scale — see size.input below. */
export const SizeControlSm: string;
/** 32px — matches Button md height. Could alias 2rem; kept a sibling raw value to sm/lg instead for consistency within this group. */
export const SizeControlMd: string;
/** 36px — matches Button lg height. */
export const SizeControlLg: string;
/** 36px, RAW — owner resized Input up a full step in Figma, deliberately diverging from size.control (still shared by Button). Equals size.control.lg/Button's own lg height, but kept as Input's own scale rather than reused since the two are free to move independently now. */
export const SizeInputSm: string;
/** 40px — equals Button's xl height, coincidentally; Input's own scale. */
export const SizeInputMd: string;
/** 44px — equals Button's 2xl height, coincidentally; Input's own scale. */
export const SizeInputLg: string;
/** 72px — exactly 2x size.input.sm (36px). A notes/multi-line field's default height, not a hard cap — the element still grows with content/manual resize. Deliberately derived from Input's own scale (double it) rather than an independent value, so the two stay proportional if Input's scale ever moves again. */
export const SizeTextareaSm: string;
/** 80px — 2x size.input.md (40px). */
export const SizeTextareaMd: string;
/** 88px — 2x size.input.lg (44px). */
export const SizeTextareaLg: string;
/** 6px — was space.8 (8px), shrunk ~25% and snapped to the nearest real space.* step so ProgressBar fits dense contexts like a TableCell (which currently uses a bespoke stage-tracker instead, precisely because the old 8/12/16 scale read too tall there). No longer aliases space.8 directly — this is now ProgressBar's own scale, split off the same way size.input split off size.control, so the two can move independently. */
export const SizeProgressBarSm: string;
/** 10px — was space.12 (12px). A straight 20% cut lands on 9.6px, which isn't a real step on this system's space/radius scale (0,2,4,6,8,10,12,16,...); 10 is the nearest real step and reads better once rendered than rounding to 9. */
export const SizeProgressBarMd: string;
/** 16px — bumped up from 12px (2026-09-16) so the largest variant reads as more clearly 'big' next to sm/md; paired with a wider 1.5px fill border (up from 1px) and a 2px track inset (up from 1px) at this size only. */
export const SizeProgressBarLg: string;
/** 16px — matches this system's standard inline-icon scale (MenuRow/TableCellText icons at md size). */
export const SizeSpinnerSm: string;
/** 20px — was 24px; tightened to a 16/20/24 progression (a standard icon-scale triplet) instead of the original 16/24/32, which jumped straight past 20. */
export const SizeSpinnerMd: string;
/** 24px — was 32px, for the same reason as md: keeps the scale on 16/20/24 rather than skipping a step. */
export const SizeSpinnerLg: string;
/** 24px */
export const SizeAvatarXs: string;
/** 28px */
export const SizeAvatarSm: string;
/** 32px */
export const SizeAvatarMd: string;
/** 40px */
export const SizeAvatarLg: string;
/** 44px — the owner's 5-size request (44/40/32/28/24) mapped onto this system's usual xs–xl naming rather than exposing raw numbers as variant names. */
export const SizeAvatarXl: string;
export const Space0: string;
/** 2px — hairline gap */
export const Space2: string;
/** 4px */
export const Space4: string;
/** 6px */
export const Space6: string;
/** 8px */
export const Space8: string;
/** 10px */
export const Space10: string;
/** 12px */
export const Space12: string;
/** 16px */
export const Space16: string;
/** 20px */
export const Space20: string;
/** 24px */
export const Space24: string;
/** 32px */
export const Space32: string;
/** 40px */
export const Space40: string;
/** 48px */
export const Space48: string;
/** 64px */
export const Space64: string;
/** 80px */
export const Space80: string;
/** 96px */
export const Space96: string;
export const FontFamilySans: string;
export const FontFamilyMono: string;
/** 10px */
export const FontSize10: string;
/** 12px */
export const FontSize12: string;
/** 13px */
export const FontSize13: string;
/** 14px */
export const FontSize14: string;
/** 15px */
export const FontSize15: string;
/** 16px */
export const FontSize16: string;
/** 18px */
export const FontSize18: string;
/** 20px */
export const FontSize20: string;
/** 24px */
export const FontSize24: string;
/** 28px */
export const FontSize28: string;
/** 32px */
export const FontSize32: string;
/** 36px */
export const FontSize36: string;
/** 48px */
export const FontSize48: string;
/** 64px */
export const FontSize64: string;
export const FontWeightMedium: number;
export const FontWeightSemibold: number;
export const FontWeightBold: number;
export const FontWeightExtrabold: number;
/** display / single-line */
export const FontLineHeightNone: number;
export const FontLineHeightTight: number;
export const FontLineHeightSnug: number;
/** body default */
export const FontLineHeightNormal: number;
export const FontLineHeightRelaxed: number;
/** large display */
export const FontLetterSpacingTighter: string;
export const FontLetterSpacingTight: string;
export const FontLetterSpacingNormal: string;
export const FontLetterSpacingWide: string;
/** overlines / all-caps */
export const FontLetterSpacingWider: string;
/** Hero / auth / empty-state headline */
export const TextDisplayXlFontFamily: string;
/** Hero / auth / empty-state headline */
export const TextDisplayXlFontSize: string;
/** Hero / auth / empty-state headline */
export const TextDisplayXlFontWeight: number;
/** Hero / auth / empty-state headline */
export const TextDisplayXlLineHeight: number;
/** Hero / auth / empty-state headline */
export const TextDisplayXlLetterSpacing: string;
export const TextDisplayLgFontFamily: string;
export const TextDisplayLgFontSize: string;
export const TextDisplayLgFontWeight: number;
export const TextDisplayLgLineHeight: number;
export const TextDisplayLgLetterSpacing: string;
export const TextDisplayMdFontFamily: string;
export const TextDisplayMdFontSize: string;
export const TextDisplayMdFontWeight: number;
export const TextDisplayMdLineHeight: number;
export const TextDisplayMdLetterSpacing: string;
/** Page title */
export const TextHeadingXlFontFamily: string;
/** Page title */
export const TextHeadingXlFontSize: string;
/** Page title */
export const TextHeadingXlFontWeight: number;
/** Page title */
export const TextHeadingXlLineHeight: number;
/** Page title */
export const TextHeadingXlLetterSpacing: string;
export const TextHeadingLgFontFamily: string;
export const TextHeadingLgFontSize: string;
export const TextHeadingLgFontWeight: number;
export const TextHeadingLgLineHeight: number;
export const TextHeadingLgLetterSpacing: string;
/** Section / card title */
export const TextHeadingMdFontFamily: string;
/** Section / card title */
export const TextHeadingMdFontSize: string;
/** Section / card title */
export const TextHeadingMdFontWeight: number;
/** Section / card title */
export const TextHeadingMdLineHeight: number;
/** Section / card title */
export const TextHeadingMdLetterSpacing: string;
export const TextHeadingSmFontFamily: string;
export const TextHeadingSmFontSize: string;
export const TextHeadingSmFontWeight: number;
export const TextHeadingSmLineHeight: number;
export const TextHeadingSmLetterSpacing: string;
/** Subsection / group label */
export const TextHeadingXsFontFamily: string;
/** Subsection / group label */
export const TextHeadingXsFontSize: string;
/** Subsection / group label */
export const TextHeadingXsFontWeight: number;
/** Subsection / group label */
export const TextHeadingXsLineHeight: number;
/** Subsection / group label */
export const TextHeadingXsLetterSpacing: string;
/** Largest body step — completes the body scale to match the label/heading ranges; used by Label's xl size so LabelGroup can render at 16px in body weight rather than the label scale's semibold. */
export const TextBodyXlFontFamily: string;
/** Largest body step — completes the body scale to match the label/heading ranges; used by Label's xl size so LabelGroup can render at 16px in body weight rather than the label scale's semibold. */
export const TextBodyXlFontSize: string;
/** Largest body step — completes the body scale to match the label/heading ranges; used by Label's xl size so LabelGroup can render at 16px in body weight rather than the label scale's semibold. */
export const TextBodyXlFontWeight: number;
/** Largest body step — completes the body scale to match the label/heading ranges; used by Label's xl size so LabelGroup can render at 16px in body weight rather than the label scale's semibold. */
export const TextBodyXlLineHeight: number;
/** Largest body step — completes the body scale to match the label/heading ranges; used by Label's xl size so LabelGroup can render at 16px in body weight rather than the label scale's semibold. */
export const TextBodyXlLetterSpacing: string;
export const TextBodyLgFontFamily: string;
export const TextBodyLgFontSize: string;
export const TextBodyLgFontWeight: number;
export const TextBodyLgLineHeight: number;
export const TextBodyLgLetterSpacing: string;
/** Default body / table cell */
export const TextBodyMdFontFamily: string;
/** Default body / table cell */
export const TextBodyMdFontSize: string;
/** Default body / table cell */
export const TextBodyMdFontWeight: number;
/** Default body / table cell */
export const TextBodyMdLineHeight: number;
/** Default body / table cell */
export const TextBodyMdLetterSpacing: string;
export const TextBodySmFontFamily: string;
export const TextBodySmFontSize: string;
export const TextBodySmFontWeight: number;
export const TextBodySmLineHeight: number;
export const TextBodySmLetterSpacing: string;
/** Dense secondary text */
export const TextBodyXsFontFamily: string;
/** Dense secondary text */
export const TextBodyXsFontSize: string;
/** Dense secondary text */
export const TextBodyXsFontWeight: number;
/** Dense secondary text */
export const TextBodyXsLineHeight: number;
/** Dense secondary text */
export const TextBodyXsLetterSpacing: string;
/** Row's smallest description size — dense, often alphanumeric-code-heavy content (e.g. flight/reference codes) at 10px reusing the existing font.size.10 primitive (already used by overline), rather than inventing an 11px step purely to keep a clean '-2 from heading' arithmetic. Gets wide tracking (unlike every other body step, all 'normal') for the same reason text/label/xs does at this size — legibility for dense uppercase content, not just smallness. */
export const TextBody2xsFontFamily: string;
/** Row's smallest description size — dense, often alphanumeric-code-heavy content (e.g. flight/reference codes) at 10px reusing the existing font.size.10 primitive (already used by overline), rather than inventing an 11px step purely to keep a clean '-2 from heading' arithmetic. Gets wide tracking (unlike every other body step, all 'normal') for the same reason text/label/xs does at this size — legibility for dense uppercase content, not just smallness. */
export const TextBody2xsFontSize: string;
/** Row's smallest description size — dense, often alphanumeric-code-heavy content (e.g. flight/reference codes) at 10px reusing the existing font.size.10 primitive (already used by overline), rather than inventing an 11px step purely to keep a clean '-2 from heading' arithmetic. Gets wide tracking (unlike every other body step, all 'normal') for the same reason text/label/xs does at this size — legibility for dense uppercase content, not just smallness. */
export const TextBody2xsFontWeight: number;
/** Row's smallest description size — dense, often alphanumeric-code-heavy content (e.g. flight/reference codes) at 10px reusing the existing font.size.10 primitive (already used by overline), rather than inventing an 11px step purely to keep a clean '-2 from heading' arithmetic. Gets wide tracking (unlike every other body step, all 'normal') for the same reason text/label/xs does at this size — legibility for dense uppercase content, not just smallness. */
export const TextBody2xsLineHeight: number;
/** Row's smallest description size — dense, often alphanumeric-code-heavy content (e.g. flight/reference codes) at 10px reusing the existing font.size.10 primitive (already used by overline), rather than inventing an 11px step purely to keep a clean '-2 from heading' arithmetic. Gets wide tracking (unlike every other body step, all 'normal') for the same reason text/label/xs does at this size — legibility for dense uppercase content, not just smallness. */
export const TextBody2xsLetterSpacing: string;
/** xl / 56px primary button */
export const TextLabelXlFontFamily: string;
/** xl / 56px primary button */
export const TextLabelXlFontSize: string;
/** xl / 56px primary button */
export const TextLabelXlFontWeight: number;
/** xl / 56px primary button */
export const TextLabelXlLineHeight: number;
/** xl / 56px primary button */
export const TextLabelXlLetterSpacing: string;
export const TextLabelLgFontFamily: string;
export const TextLabelLgFontSize: string;
export const TextLabelLgFontWeight: number;
export const TextLabelLgLineHeight: number;
export const TextLabelLgLetterSpacing: string;
/** Button / input / tab label */
export const TextLabelMdFontFamily: string;
/** Button / input / tab label */
export const TextLabelMdFontSize: string;
/** Button / input / tab label */
export const TextLabelMdFontWeight: number;
/** Button / input / tab label */
export const TextLabelMdLineHeight: number;
/** Button / input / tab label */
export const TextLabelMdLetterSpacing: string;
/** Table header / chip */
export const TextLabelSmFontFamily: string;
/** Table header / chip */
export const TextLabelSmFontSize: string;
/** Table header / chip */
export const TextLabelSmFontWeight: number;
/** Table header / chip */
export const TextLabelSmLineHeight: number;
/** Table header / chip */
export const TextLabelSmLetterSpacing: string;
export const TextLabelXsFontFamily: string;
export const TextLabelXsFontSize: string;
export const TextLabelXsFontWeight: number;
export const TextLabelXsLineHeight: number;
export const TextLabelXsLetterSpacing: string;
/** All-caps section kicker — apply text-transform: uppercase in the component */
export const TextOverlineFontFamily: string;
/** All-caps section kicker — apply text-transform: uppercase in the component */
export const TextOverlineFontSize: string;
/** All-caps section kicker — apply text-transform: uppercase in the component */
export const TextOverlineFontWeight: number;
/** All-caps section kicker — apply text-transform: uppercase in the component */
export const TextOverlineLineHeight: number;
/** All-caps section kicker — apply text-transform: uppercase in the component */
export const TextOverlineLetterSpacing: string;
/** Helper text, timestamps, footnotes */
export const TextCaptionFontFamily: string;
/** Helper text, timestamps, footnotes */
export const TextCaptionFontSize: string;
/** Helper text, timestamps, footnotes */
export const TextCaptionFontWeight: number;
/** Helper text, timestamps, footnotes */
export const TextCaptionLineHeight: number;
/** Helper text, timestamps, footnotes */
export const TextCaptionLetterSpacing: string;
/** Inline IDs, JSON, tracking numbers */
export const TextCodeFontFamily: string;
/** Inline IDs, JSON, tracking numbers */
export const TextCodeFontSize: string;
/** Inline IDs, JSON, tracking numbers */
export const TextCodeFontWeight: number;
/** Inline IDs, JSON, tracking numbers */
export const TextCodeLineHeight: number;
/** Inline IDs, JSON, tracking numbers */
export const TextCodeLetterSpacing: string;
