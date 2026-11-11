import { FieldSelect } from '@/components/Select';
import { TextField } from '@/components/TextField';
import { Tag } from '@/components/Tag';
import { knowledgeFields, knowledgeLabel } from './knowledgeFields';

/** The last choice in the dropdown: the list lacks what the person works in. */
export const OTHER_FIELD = '__other__';

export interface SpecialtyPickerLabels {
  otherOption: string;
  otherLabel: string;
  otherHint: string;
  field: string;
  select: string;
  specialties: string;
  specialtiesHint: string;
  firstField: string;
}

/**
 * The official list, chosen from instead of typed, in two plain steps: the
 * field of knowledge, then its specialities, which all show at once and are
 * ticked on and off. Changing the field starts the specialities again.
 */
export function SpecialtyPicker({
  field,
  specialties,
  other,
  onOther,
  onChange,
  labels,
  requiredMark = ' *',
  fieldInvalid,
  specialtiesInvalid,
  locale = 'uk',
}: {
  field: string;
  specialties: string[];
  other: string;
  onOther: (v: string) => void;
  onChange: (next: { field: string; specialties: string[] }) => void;
  labels: SpecialtyPickerLabels;
  requiredMark?: string;
  fieldInvalid?: boolean;
  specialtiesInvalid?: boolean;
  /** Which language the names are shown in; the stored value is always the Ukrainian name. */
  locale?: 'en' | 'uk';
}) {
  const group = knowledgeFields.find((g) => g.field === field);
  const toggle = (s: string) =>
    onChange({
      field,
      specialties: specialties.includes(s) ? specialties.filter((x) => x !== s) : [...specialties, s],
    });

  return (
    <div className="flex flex-col gap-6">
      <FieldSelect
        label={labels.field + requiredMark}
        options={[...knowledgeFields.map((g) => ({ value: g.field, label: knowledgeLabel(g.field, locale) })), { value: OTHER_FIELD, label: labels.otherOption }]}
        value={field}
        onChange={(v) =>
          onChange({
            field: v,
            specialties: specialties.filter((s) =>
              knowledgeFields.find((g) => g.field === v)?.specialties.includes(s),
            ),
          })
        }
        placeholder={labels.select}
        invalid={fieldInvalid}
      />
      {field === OTHER_FIELD ? (
        <div>
          <TextField
            label={labels.otherLabel + requiredMark}
            value={other}
            onChange={(e) => onOther(e.target.value)}
            aria-invalid={specialtiesInvalid || undefined}
          />
          <p className="mt-3 font-mono text-breadcrumbs text-brand-muted">{labels.otherHint}</p>
        </div>
      ) : (
      <div role="group" aria-label={labels.specialties}>
        <p className="mb-3 font-ukraine text-[14px] leading-[20px] text-brand-muted">
          {labels.specialties}
          {requiredMark}
        </p>
        {group ? (
          <>
            <ul
              className={`m-0 flex list-none flex-wrap gap-2.5 p-0 ${specialtiesInvalid ? 'outline outline-2 outline-offset-4 outline-brand-accent-yellow' : ''}`}
            >
              {group.specialties.map((s) => {
                const on = specialties.includes(s);
                return (
                  <li key={s}>
                    <Tag
                      type="button"
                      variant={on ? 'accent' : 'default'}
                      aria-pressed={on}
                      onClick={() => toggle(s)}
                      className="min-h-[36px]! py-1.5! text-[14px]! leading-[20px]! tracking-[-0.03em]!"
                    >
                      {on ? '✓ ' : ''}
                      {knowledgeLabel(s, locale)}
                    </Tag>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 font-mono text-breadcrumbs text-brand-muted">{labels.specialtiesHint}</p>
          </>
        ) : (
          <p className="m-0 font-mono text-breadcrumbs text-brand-muted">{labels.firstField}</p>
        )}
      </div>
      )}
    </div>
  );
}
