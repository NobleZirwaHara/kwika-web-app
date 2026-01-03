# Error Display Implementation Guide

This guide explains how to add elegant error displays to all forms in the Kwika Events platform.

## Components Available

### 1. ErrorDisplay
Displays form-level errors with elegant styling.

```tsx
import { ErrorDisplay } from '@/Components/ui/error-display'

// Single error (string)
<ErrorDisplay errors="Invalid credentials" title="Login Error" />

// Multiple errors (object)
<ErrorDisplay
  errors={{
    name: "Name is required",
    email: "Email must be valid"
  }}
  title="Validation Error"
/>
```

### 2. FieldError
Displays field-level errors below form inputs.

```tsx
import { FieldError } from '@/Components/ui/error-display'

<Input
  className={errors.email ? 'border-destructive' : ''}
  {...props}
/>
<FieldError error={errors?.email} />
```

### 3. FormWrapper
Automatically handles error display for entire forms.

```tsx
import { FormWrapper } from '@/Components/ui/form-wrapper'

<FormWrapper
  onSubmit={handleSubmit}
  errors={errors}
  errorTitle="Booking Error"
  excludeFieldsFromGeneral={['name', 'email', 'date']}
>
  <div>
    <Label>Name</Label>
    <Input className={errors.name ? 'border-destructive' : ''} />
    <FieldError error={errors?.name} />
  </div>
</FormWrapper>
```

## Implementation Patterns

### Pattern 1: Simple Forms (Inertia useForm)

```tsx
import { useForm } from '@inertiajs/react'
import { FormWrapper } from '@/Components/ui/form-wrapper'
import { FieldError } from '@/Components/ui/error-display'

export default function MyForm() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/endpoint')
  }

  return (
    <FormWrapper
      onSubmit={handleSubmit}
      errors={errors}
      errorTitle="Form Submission Error"
      excludeFieldsFromGeneral={['name', 'email']}
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          className={errors.name ? 'border-destructive' : ''}
        />
        <FieldError error={errors.name} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          className={errors.email ? 'border-destructive' : ''}
        />
        <FieldError error={errors.email} />
      </div>

      <Button type="submit" disabled={processing}>
        {processing ? 'Submitting...' : 'Submit'}
      </Button>
    </FormWrapper>
  )
}
```

### Pattern 2: Forms with Client-Side Validation

```tsx
import { useState } from 'react'
import { router } from '@inertiajs/react'
import { ErrorDisplay, FieldError } from '@/Components/ui/error-display'

export default function MyForm({ errors: serverErrors }) {
  const [clientError, setClientError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setClientError(null)

    // Client-side validation
    if (!eventDate) {
      setClientError('Please select an event date')
      return
    }

    router.post('/endpoint', data, {
      onError: () => {
        setClientError('Submission failed. Please check the form and try again.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Display both client and server errors */}
      {(clientError || serverErrors) && (
        <ErrorDisplay
          errors={serverErrors || clientError || undefined}
          title="Form Error"
        />
      )}

      {/* Form fields with FieldError */}
      <div>
        <Label>Event Date</Label>
        <DatePicker ... />
        <FieldError error={serverErrors?.event_date} />
      </div>
    </form>
  )
}
```

### Pattern 3: Complex Forms with Multiple Sections

```tsx
export default function ComplexForm({ errors }) {
  const { data, setData, post, processing } = useForm({...})

  return (
    <FormWrapper
      onSubmit={handleSubmit}
      errors={errors}
      errorTitle="Submission Error"
      excludeFieldsFromGeneral={[
        'name', 'email', 'phone',
        'address', 'city', 'country',
        'service_name', 'service_description'
      ]}
    >
      {/* Section 1: Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input className={errors.name ? 'border-destructive' : ''} />
            <FieldError error={errors.name} />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Service Details */}
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Service Name</Label>
            <Input className={errors.service_name ? 'border-destructive' : ''} />
            <FieldError error={errors.service_name} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={processing}>Submit</Button>
    </FormWrapper>
  )
}
```

## Forms Already Implemented

✅ **Auth Forms:**
- `resources/js/Pages/Auth/Login.tsx`
- `resources/js/Pages/Auth/Register.tsx`

✅ **Booking Forms:**
- `resources/js/Pages/Booking/CreateCustom.tsx`

## Forms That Need Implementation

The following forms should be updated to include error displays:

### High Priority (User-Facing)
- [ ] `resources/js/Pages/ServiceDetail.tsx` - Service booking form
- [ ] `resources/js/Pages/ProductDetail.tsx` - Product booking form
- [ ] `resources/js/Pages/ProviderDetail.tsx` - Any forms here
- [ ] `resources/js/Pages/Ticketing/EventDetail.tsx` - Ticket booking

### Provider Dashboard Forms
- [ ] `resources/js/Pages/Provider/Services.tsx`
- [ ] `resources/js/Pages/Provider/Settings.tsx`
- [ ] `resources/js/Pages/Provider/Companies/Create.tsx`
- [ ] `resources/js/Pages/Provider/Companies/Edit.tsx`
- [ ] `resources/js/Pages/Provider/Events/Create.tsx`
- [ ] `resources/js/Pages/Provider/Events/Edit.tsx`
- [ ] `resources/js/Pages/Provider/Products/Create.tsx`
- [ ] `resources/js/Pages/Provider/Products/Edit.tsx`
- [ ] `resources/js/Pages/Provider/Promotions/Create.tsx`
- [ ] `resources/js/Pages/Provider/Promotions/Edit.tsx`
- [ ] `resources/js/Pages/Provider/ServiceCatalogues/Create.tsx`
- [ ] `resources/js/Pages/Provider/ServiceCatalogues/Edit.tsx`
- [ ] `resources/js/Pages/Provider/ProductCatalogues/Create.tsx`
- [ ] `resources/js/Pages/Provider/ProductCatalogues/Edit.tsx`

### Admin Dashboard Forms
- [ ] All forms in `resources/js/Pages/Admin/*/Create.tsx`
- [ ] All forms in `resources/js/Pages/Admin/*/Edit.tsx`

## Quick Migration Steps

For any existing form using Inertia's `useForm`:

1. **Import the components:**
   ```tsx
   import { FormWrapper } from '@/Components/ui/form-wrapper'
   import { FieldError } from '@/Components/ui/error-display'
   ```

2. **Wrap the form:**
   ```tsx
   // OLD
   <form onSubmit={handleSubmit}>

   // NEW
   <FormWrapper
     onSubmit={handleSubmit}
     errors={errors}
     errorTitle="Appropriate Title"
     excludeFieldsFromGeneral={['list', 'of', 'field', 'names']}
   >
   ```

3. **Add field errors:**
   ```tsx
   // After each input
   <Input className={errors.fieldName ? 'border-destructive' : ''} />
   <FieldError error={errors.fieldName} />
   ```

4. **Update border styling:**
   ```tsx
   // OLD
   className={errors.email ? 'border-red-500' : ''}

   // NEW
   className={errors.email ? 'border-destructive' : ''}
   ```

## Best Practices

1. **Always show field-level errors** - Users should see what's wrong with each field
2. **Use descriptive error titles** - "Login Error", "Booking Error", "Service Creation Error"
3. **Exclude all field names from general display** - Avoid duplication
4. **Add visual feedback to inputs** - Use `border-destructive` class when field has error
5. **Show errors above the form** - Users see errors before filling out fields again
6. **Use animations** - The components have built-in fade-in animations

## Styling

All error components use consistent Tailwind classes:
- `text-destructive` for error text
- `border-destructive` for error borders
- `bg-destructive/10` for error backgrounds (in Alert)
- Smooth animations with `animate-in fade-in-0 slide-in-from-*`

## Examples in Action

### Simple Login Form
![Error Display Example](docs/images/error-display-login.png)

### Complex Multi-Section Form
![Error Display Complex](docs/images/error-display-complex.png)

## Support

For questions or issues with error display implementation:
1. Check this guide first
2. Review the implemented examples in Auth forms
3. Check the component source code in `resources/js/Components/ui/error-display.tsx`
