import { useState } from 'react'
import Input from './Input'
import Textarea from './Textarea'
import Select from './Select'
import Button from './Button'
import MediaPicker from './MediaPicker'

function MediaSelectButton({ value, onChange }) {
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">Image</label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <img src={value} alt="" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <Button type="button" variant="secondary" onClick={() => setPickerOpen(true)}>
            {value ? 'Change' : 'Select from Library'}
          </Button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs text-error-600 hover:text-error-700"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(media) => onChange(media.url)}
      />
    </div>
  )
}

function ListEditor({ items, onChange, fields, itemLabel }) {
  const updateItem = (index, field, value) => {
    const next = [...items]
    next[index] = { ...next[index], [field]: value }
    onChange(next)
  }

  const addItem = () => {
    const emptyItem = {}
    fields.forEach((f) => { emptyItem[f.name] = '' })
    onChange([...items, emptyItem])
  }

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-gray-200 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">{itemLabel} {index + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-xs text-error-600 hover:text-error-700"
            >
              Remove
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.name}>
                {field.type === 'textarea' ? (
                  <Textarea
                    label={field.label}
                    value={item[field.name] || ''}
                    onChange={(e) => updateItem(index, field.name, e.target.value)}
                    rows={2}
                  />
                ) : (
                  <Input
                    label={field.label}
                    value={item[field.name] || ''}
                    onChange={(e) => updateItem(index, field.name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={addItem}>
        + Add {itemLabel}
      </Button>
    </div>
  )
}

export default function SectionEditor({ type, content, onChange }) {
  const update = (field, value) => {
    onChange({ ...content, [field]: value })
  }

  switch (type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <Input label="Title" value={content.title || ''} onChange={(e) => update('title', e.target.value)} />
          <Textarea label="Subtitle" value={content.subtitle || ''} onChange={(e) => update('subtitle', e.target.value)} rows={2} />
          <Input label="Button Text" value={content.buttonText || ''} onChange={(e) => update('buttonText', e.target.value)} />
          <Input label="Button URL" value={content.buttonUrl || ''} onChange={(e) => update('buttonUrl', e.target.value)} placeholder="/about-us" />
          <MediaSelectButton value={content.image || ''} onChange={(url) => update('image', url)} />
        </div>
      )

    case 'about':
      return (
        <div className="space-y-4">
          <Input label="Title" value={content.title || ''} onChange={(e) => update('title', e.target.value)} />
          <Textarea label="Description" value={content.description || ''} onChange={(e) => update('description', e.target.value)} rows={4} />
          <MediaSelectButton value={content.image || ''} onChange={(url) => update('image', url)} />
        </div>
      )

    case 'services':
      return (
        <div className="space-y-4">
          <Input label="Title" value={content.title || ''} onChange={(e) => update('title', e.target.value)} />
          <Textarea label="Description" value={content.description || ''} onChange={(e) => update('description', e.target.value)} rows={2} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Services</label>
            <ListEditor
              items={content.services || []}
              onChange={(services) => update('services', services)}
              fields={[
                { name: 'title', label: 'Service Title', type: 'text' },
                { name: 'description', label: 'Service Description', type: 'textarea' },
              ]}
              itemLabel="Service"
            />
          </div>
        </div>
      )

    case 'gallery':
      return (
        <div className="space-y-4">
          <Input label="Title" value={content.title || ''} onChange={(e) => update('title', e.target.value)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Images</label>
            <ListEditor
              items={content.images || []}
              onChange={(images) => update('images', images)}
              fields={[{ name: 'url', label: 'Image URL', type: 'text' }]}
              itemLabel="Image"
            />
          </div>
        </div>
      )

    case 'testimonial':
      return (
        <div className="space-y-4">
          <Input label="Title" value={content.title || ''} onChange={(e) => update('title', e.target.value)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Testimonials</label>
            <ListEditor
              items={content.testimonials || []}
              onChange={(testimonials) => update('testimonials', testimonials)}
              fields={[
                { name: 'name', label: 'Name', type: 'text' },
                { name: 'role', label: 'Role / Company', type: 'text' },
                { name: 'quote', label: 'Quote', type: 'textarea' },
              ]}
              itemLabel="Testimonial"
            />
          </div>
        </div>
      )

    case 'cta':
      return (
        <div className="space-y-4">
          <Input label="Title" value={content.title || ''} onChange={(e) => update('title', e.target.value)} />
          <Textarea label="Description" value={content.description || ''} onChange={(e) => update('description', e.target.value)} rows={2} />
          <Input label="Button Text" value={content.buttonText || ''} onChange={(e) => update('buttonText', e.target.value)} />
          <Input label="Button URL" value={content.buttonUrl || ''} onChange={(e) => update('buttonUrl', e.target.value)} />
        </div>
      )

    case 'contact':
      return (
        <div className="space-y-4">
          <Input label="Title" value={content.title || ''} onChange={(e) => update('title', e.target.value)} />
          <Textarea label="Description" value={content.description || ''} onChange={(e) => update('description', e.target.value)} rows={2} />
          <Input label="Email" value={content.email || ''} onChange={(e) => update('email', e.target.value)} />
          <Input label="Phone" value={content.phone || ''} onChange={(e) => update('phone', e.target.value)} />
          <Input label="Address" value={content.address || ''} onChange={(e) => update('address', e.target.value)} />
        </div>
      )

    case 'richtext':
      return (
        <div className="space-y-4">
          <Input label="Title" value={content.title || ''} onChange={(e) => update('title', e.target.value)} />
          <Textarea label="Content" value={content.content || ''} onChange={(e) => update('content', e.target.value)} rows={6} />
        </div>
      )

    case 'imagetext':
      return (
        <div className="space-y-4">
          <Input label="Title" value={content.title || ''} onChange={(e) => update('title', e.target.value)} />
          <Textarea label="Description" value={content.description || ''} onChange={(e) => update('description', e.target.value)} rows={3} />
          <MediaSelectButton value={content.image || ''} onChange={(url) => update('image', url)} />
          <Select
            label="Image Position"
            value={content.imagePosition || 'left'}
            onChange={(e) => update('imagePosition', e.target.value)}
            options={[
              { value: 'left', label: 'Image Left' },
              { value: 'right', label: 'Image Right' },
            ]}
          />
        </div>
      )

    case 'faq':
      return (
        <div className="space-y-4">
          <Input label="Title" value={content.title || ''} onChange={(e) => update('title', e.target.value)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">FAQ Items</label>
            <ListEditor
              items={content.items || []}
              onChange={(items) => update('items', items)}
              fields={[
                { name: 'question', label: 'Question', type: 'text' },
                { name: 'answer', label: 'Answer', type: 'textarea' },
              ]}
              itemLabel="Item"
            />
          </div>
        </div>
      )

    default:
      return <p className="text-sm text-gray-500">No editor available for this section type.</p>
  }
}
