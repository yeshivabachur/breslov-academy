import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';

export default function AutoForm({ schema, onSubmit, defaultValues = {} }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });

  // Introspect the Zod schema to determine field types
  // This is a simplified introspection strategy.
  const shape = schema._def.shape ? schema.shape : {}; 

  const renderField = (key, fieldSchema) => {
    let type = 'text';
    let options = [];
    let isBoolean = false;

    // Deep dive into Zod definitions
    let def = fieldSchema._def;
    
    // Handle ZodDefault / ZodOptional wrappers
    while (def.typeName === 'ZodDefault' || def.typeName === 'ZodOptional' || def.typeName === 'ZodNullable') {
      def = def.innerType._def;
    }

    if (def.typeName === 'ZodNumber') type = 'number';
    if (def.typeName === 'ZodBoolean') isBoolean = true;
    if (def.typeName === 'ZodEnum') {
      type = 'select';
      options = def.values;
    }
    
    // Naive heuristic for textarea
    if (key.includes('description') || key.includes('content') || key.includes('text')) {
      if (type === 'text') type = 'textarea';
    }

    const error = form.formState.errors[key];

    return (
      <div key={key} className="space-y-2">
        {isBoolean ? (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={key} 
              onCheckedChange={c => form.setValue(key, c)} 
              {...form.register(key)} 
            />
            <Label htmlFor={key} className="capitalize">{key.replace(/_/g, ' ')}</Label>
          </div>
        ) : (
          <>
            <Label htmlFor={key} className="capitalize">{key.replace(/_/g, ' ')}</Label>
            
            {type === 'select' ? (
              <Select onValueChange={v => form.setValue(key, v)} defaultValue={defaultValues[key]}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${key}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === 'textarea' ? (
              <Textarea {...form.register(key)} />
            ) : (
              <Input type={type} {...form.register(key, { valueAsNumber: type === 'number' })} />
            )}
          </>
        )}
        
        {error && <p className="text-sm text-destructive">{error.message}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {Object.entries(shape).map(([key, fieldSchema]) => renderField(key, fieldSchema))}
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Saving...' : 'Save Record'}
      </Button>
    </form>
  );
}
