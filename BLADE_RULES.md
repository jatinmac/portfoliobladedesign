# Blade Rules for Codex

This project uses `@razorpay/blade` v12.98.1 as the app-wide design system. Codex must treat Blade as the default UI layer for every frontend edit in this repository.

## Required Workflow

- Before adding or changing frontend UI, read this file and follow it.
- Use Blade MCP docs before adding a Blade component, changing component props, or using a Blade pattern you are not certain about.
- Import Blade UI components, icons, hooks, and types from `src/components/blade/PortfolioPrimitives.tsx`.
- Do not bypass the project barrel with direct `@razorpay/blade/components` imports except in provider/type infrastructure files that must wire Blade itself.
- If a Blade export is missing from the project barrel, update the barrel with the specific component, icon, hook, or type instead of importing around it.
- Use `Box` and Blade styled props for layout. Use tokenized spacing, color, radius, elevation, and typography values.
- Keep native HTML only when Blade has no equivalent or when HTML semantics require it, such as `form`, `img`, `picture`, `source`, `canvas`, `video`, `audio`, and markdown-rendered content.

## Import Pattern

```tsx
import {
  Box,
  Button,
  Heading,
  SearchIcon,
  Text,
  TextInput,
} from '../components/blade/PortfolioPrimitives';
```

Adjust the relative path for the current file. For shared component code under `src/components`, prefer the local relative path to `src/components/blade/PortfolioPrimitives.tsx`.

## HTML to Blade Mapping

| Do not use | Use instead |
|---|---|
| `div` | `Box` |
| `section`, `main`, `aside`, `header`, `footer`, `nav` | `Box as="section"`, `Box as="main"`, etc. |
| `p`, `span` | `Text` |
| `h1` through `h6` | `Heading` or `Display` |
| `button` | `Button` or `IconButton` |
| clickable icon | `IconButton` |
| `a` | `Link` or `Button href="..."` |
| `input type="text"` | `TextInput` |
| `input type="search"` | `SearchInput` |
| `input type="password"` | `PasswordInput` |
| `input type="tel"` | `PhoneNumberInput` |
| OTP fields | `OTPInput` |
| `textarea` | `TextArea` |
| `select` | `SelectInput` |
| autocomplete/combobox | `AutoComplete` |
| `input type="checkbox"` | `Checkbox` or `CheckboxGroup` |
| `input type="radio"` | `Radio` or `RadioGroup` |
| toggle checkbox | `Switch` |
| numeric counter | `CounterInput` |
| date input | `DatePicker` or `FilterChipDatePicker` |
| time input | `TimePicker` |
| file input | `FileUpload` |
| `table` and table children | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, etc. |
| `ul`, `ol`, `li` | `List`, `ListItem`, or `ActionList` |
| app side navigation | `SideNav` |
| app top navigation | `TopNav` |
| tab navigation | `Tabs`, `TabList`, `TabItem`, `TabPanel`, or `TabNav` |
| breadcrumbs | `Breadcrumb`, `BreadcrumbItem` |
| `dialog` | `Modal`, `Drawer`, or `BottomSheet` |
| contextual menu | `Menu` or `Dropdown` |
| tooltip | `Tooltip` |
| popover | `Popover` |
| `hr` | `Divider` |
| `progress` | `ProgressBar` |
| loading placeholder | `Skeleton` or `Spinner` |
| badge/pill | `Badge`, `Tag`, `Chip`, or `Indicator` |
| announcement/status panel | `Alert` |

## Forbidden Patterns

- Do not use raw HTML form controls when Blade has an equivalent.
- Do not use raw `button`, `a`, `input`, `textarea`, `select`, `table`, `ul`, `ol`, or heading tags in React UI.
- Do not add inline `style={{ ... }}` to Blade UI; use Blade props and tokens.
- Do not add CSS Modules, Tailwind utility classes, or new global CSS for component styling.
- Do not wrap Blade components with `styled()`. Use `Box`, component props, or a custom primitive that composes Blade without breaking internals.
- Do not override Blade generated class names or use `!important`.
- Do not hardcode direct color hex/rgb/hsl values in UI code. Use `theme.colors.*` tokens or Blade color props.
- Do not use raw pixel spacing for margins, padding, or gaps when a Blade spacing token exists.
- Do not declare custom font families in component UI. Blade fonts are wired globally.
- Do not import Material UI, Chakra, Ant Design, Mantine UI, Radix UI, or other competing component systems for portfolio UI.

## Token Quick Reference

Use tokens by name in Blade props or through the Blade theme object.

| Token family | Use |
|---|---|
| `spacing.0` through `spacing.11` | Margins, padding, gaps, inset offsets. Values map to 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56. |
| `breakpoints.base`, `xs`, `s`, `m`, `l`, `xl` | Responsive object props. Breakpoints are 0, 320, 480, 768, 1024, 1200. |
| `theme.colors.surface.*` | Page, card, border, text, and icon surfaces. |
| `theme.colors.interactive.*` | Interactive backgrounds, borders, text, and icons. |
| `theme.colors.feedback.*` | Positive, negative, notice, information, and neutral feedback. |
| `theme.colors.overlay.*` and `theme.colors.popup.*` | Overlays, popups, menus, modals, and elevated panels. |
| `theme.elevation.onLight.*`, `theme.elevation.onDark.*` | `none`, `lowRaised`, `midRaised`, `highRaised`. |
| `theme.border.radius.*` | `none`, `2xsmall`, `xsmall`, `small`, `medium`, `large`, `xlarge`, `2xlarge`, `max`, `round`. |
| `theme.border.width.*` | `none`, `thinner`, `thin`, `thick`, `thicker`. |
| typography sizes | `Text`: body `xsmall` to `large`, caption `small` or `medium`. `Heading`: `small` to `2xlarge`. `Display`: `small` to `xlarge`. |
| typography weights | `regular`, `medium`, `semibold`; `Code` also supports `bold`. |

For responsive props, use Blade's mobile-first object syntax:

```tsx
<Box
  display="flex"
  flexDirection={{ base: 'column', m: 'row' }}
  gap={{ base: 'spacing.4', m: 'spacing.6' }}
/>
```

## Component Catalog

The project barrel re-exports a curated subset of Blade v12.98.1 exports from `@razorpay/blade/components` to keep client bundles smaller. Use this catalog to choose the right component before creating a custom primitive, then add only the specific missing export to `src/components/blade/PortfolioPrimitives.tsx`.

### Providers and System

- `BladeProvider`: App-level Blade theme and color scheme provider.
- `ToastContainer`, `useToast`: Toast rendering and imperative toast actions.
- `useTheme`: Access current Blade theme and color scheme.
- `VisuallyHidden`: Accessible screen-reader-only content.
- `SkipNavLink`, `SkipNavContent`: Keyboard skip-link affordances.
- `announce`, `clearAnnouncer`, `destroyAnnouncer`: Screen reader announcements.

### Layout and Structure

- `Box`: Default layout primitive for flex, grid, spacing, positioning, visual props, and semantic `as` rendering.
- `Card`, `CardHeader`, `CardBody`, `CardFooter`, `CardFooterLeading`, `CardFooterTrailing`, `CardFooterAction`: Framed content blocks.
- `Divider`: Visual separator.
- `Elevate`: Elevation wrapper for interaction or layering.
- `Carousel`, `CarouselItem`: Horizontal item browsing.
- `Collapsible`, `CollapsibleBody`, `CollapsibleButton`, `CollapsibleLink`: Expandable sections.
- `Accordion`, `AccordionItem`, `AccordionItemHeader`, `AccordionItemBody`: Stacked disclosure groups.

### Typography and Content

- `Text`: Body and caption copy.
- `Heading`: Semantic headings.
- `Display`: Larger display headings.
- `Code`: Inline code and highlighted code snippets.
- `Amount`: Currency and numeric amount formatting.
- `Link`: Text link or icon link.
- `Badge`, `Tag`, `Chip`, `ChipGroup`, `Indicator`: Labels, status, filtering chips, and visual indicators.
- `Avatar`, `AvatarGroup`: Person/entity avatars.
- `Identifier`: Entity identity block.
- `InfoGroup`, `InfoItem`, `InfoItemKey`, `InfoItemValue`: Label-value metadata layouts.
- `EmptyState`: Empty result or no-data state.

### Actions

- `Button`, `ButtonGroup`: Primary, secondary, and tertiary actions.
- `IconButton`: Icon-only action with accessible label.
- `DropdownButton`, `DropdownIconButton`, `InputDropdownButton`: Trigger variants for dropdowns and input-adjacent controls.
- `Link` with `href`: Navigation action.

### Forms and Inputs

- `TextInput`: Standard text field.
- `TextArea`: Multiline field.
- `SearchInput`: Search field.
- `PasswordInput`: Password field with visibility affordance.
- `OTPInput`: One-time-passcode entry.
- `PhoneNumberInput`: Phone input with country support.
- `SelectInput`: Select/listbox input.
- `AutoComplete`: Typeahead selection.
- `Checkbox`, `CheckboxGroup`: Checkbox input and grouped selections.
- `Radio`, `RadioGroup`: Exclusive selection.
- `Switch`: Binary toggle.
- `CounterInput`: Numeric counter input.
- `InputGroup`, `InputRow`: Form layout helpers.
- `DatePicker`, `TimePicker`: Date/time entry.
- `FileUpload`, `FileUploadItem`: File attachment workflows.

### Navigation

- `TopNav`, `TopNavBrand`, `TopNavContent`, `TopNavActions`: Top application navigation.
- `SideNav`, `SideNavBody`, `SideNavFooter`, `SideNavSection`, `SideNavItem`, `SideNavLink`: Side application navigation.
- `BottomNav`, `BottomNavItem`: Mobile bottom navigation.
- `Breadcrumb`, `BreadcrumbItem`: Hierarchical navigation.
- `Tabs`, `TabList`, `TabItem`, `TabPanel`: Tabbed content panels.
- `TabNav`, `TabNavItem`: Navigation-style tabs.
- `Pagination`, `TablePagination`: Page navigation.
- `StepGroup`, `StepItem`, `StepItemIcon`, `StepItemIndicator`: Multi-step flow progress.

### Feedback

- `Alert`: Inline system feedback.
- `ProgressBar`: Progress or meter indicator.
- `Spinner`: Loading indicator.
- `Skeleton`: Loading placeholder.
- `ToastContainer`, `useToast`: Toast feedback.
- `SpotlightPopoverTour`, `SpotlightPopoverTourFooter`: Guided tours.

### Overlays

- `Modal`, `ModalHeader`, `ModalBody`, `ModalFooter`: Blocking dialog.
- `Drawer`, `DrawerHeader`, `DrawerBody`, `DrawerFooter`: Side panel.
- `BottomSheet`, `BottomSheetHeader`, `BottomSheetBody`, `BottomSheetFooter`: Mobile sheet.
- `Popover`, `PopoverInteractiveWrapper`: Contextual floating content.
- `Tooltip`, `TooltipInteractiveWrapper`: Short hover/focus help.
- `Menu`, `MenuHeader`, `MenuItem`, `MenuDivider`, `MenuFooter`, `MenuOverlay`: Action menus.
- `Dropdown`, `DropdownHeader`, `DropdownFooter`, `DropdownLink`, `DropdownOverlay`: Dropdown controls.
- `LightBox`, `LightBoxBody`, `LightBoxItem`: Media lightbox.
- `Preview`, `PreviewHeader`, `PreviewBody`, `PreviewFooter`: Preview overlay.

### Data Display

- `Table`, `TableHeader`, `TableHeaderRow`, `TableHeaderCell`, `TableBody`, `TableRow`, `TableCell`, `TableFooter`, `TableFooterRow`, `TableFooterCell`: Structured tabular data.
- `TableEditableCell`, `TableEditableDropdownCell`: Editable table cells.
- `TableToolbar`, `TableToolbarActions`: Table-level controls.
- `List`, `ListItem`, `ListItemText`, `ListItemCode`, `ListItemLink`: Simple lists.
- `ListView`, `ListViewFilters`: List pages with filters.
- `ActionList`, `ActionListSection`, `ActionListSectionTitle`, `ActionListItem`, `ActionListItemText`, `ActionListItemAsset`, `ActionListItemIcon`, `ActionListItemAvatar`, `ActionListItemBadge`, `ActionListItemBadgeGroup`: Selectable/actionable lists.

### Filtering

- `QuickFilter`, `QuickFilterGroup`: Quick filter controls.
- `FilterChipGroup`, `FilterChipSelectInput`, `FilterChipDatePicker`: Chip-based filters.
- `Chip`, `ChipGroup`: Tag-like selections.

### Charts

- `ChartArea`, `ChartAreaWrapper`: Area charts.
- `ChartBar`, `ChartBarWrapper`: Bar charts.
- `ChartLine`, `ChartLineWrapper`: Line charts.
- `ChartDonut`, `ChartDonutCell`, `ChartDonutWrapper`: Donut charts.
- `ChartTooltip`, `ChartLegend`, `ChartReferenceLine`, `ChartCartesianGrid`, `ChartXAxis`, `ChartYAxis`: Shared chart building blocks.

### Chat and Generated UI

- `ChatInput`: Chat composer.
- `ChatMessage`: Chat transcript message.
- `GenUIProvider`, `GenUISchemaRenderer`, `useGenUI`, `useGenUIAction`: Schema-rendered generated UI.

### Motion and Brand Effects

- `AnimateInteractions`: Interaction animation wrapper.
- `Fade`, `Slide`, `Scale`, `Move`, `Morph`, `Stagger`: Motion primitives.
- `RazorSense`, `RazorSenseGradient`, `preloadRazorSenseAssets`: Blade branded visual effects.

### Icons

- All Blade icons are available from the project barrel and end in `Icon`, for example `SearchIcon`, `CloseIcon`, `ArrowRightIcon`, `GithubIcon`, `ExternalLinkIcon`, `DownloadIcon`, `SendIcon`, `MenuIcon`, `MoonIcon`, and `SunIcon`.
- Filled product icons are also available where Blade exports them, for example `PaymentGatewayFilledIcon`.
- Use icons through component props when possible: `<Button icon={SearchIcon}>Search</Button>`.
- If an icon itself is clickable, use `IconButton` instead of adding an `onClick` to the icon.

## When Blade Is Not Enough

If Blade does not provide a component for the required behavior:

- Prefer composing `Box`, `Text`, `Heading`, and existing Blade controls.
- Keep custom primitives in `src/components/blade/` or a nearby feature component.
- Use theme tokens for every visual value.
- Add a short comment only when the custom behavior is non-obvious.
- Document why a native element or custom implementation was required.
