import { Head, Link, router } from '@inertiajs/react'
import ProviderLayout from '@/Components/ProviderLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Building2, Plus, Edit, Trash2, MoreVertical } from 'lucide-react'

interface Company {
  id: number
  name: string
  slug: string
  description: string | null
  city: string | null
  phone: string | null
  email: string | null
  logo: string | null
  is_active: boolean
  catalogues_count: number
  created_at: string
}

interface Props {
  companies: Company[]
}

export default function CompaniesIndex({ companies }: Props) {
  function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      router.delete(`/provider/companies/${id}`)
    }
  }

  return (
    <ProviderLayout title="Companies">
      <Head title="Companies" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Companies</h1>
            <p className="text-muted-foreground mt-1">
              Manage your business companies and brands
            </p>
          </div>
          <Button asChild>
            <Link href="/provider/companies/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Link>
          </Button>
        </div>

        {/* Companies Grid */}
        {companies.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                        <Badge variant={company.is_active ? 'default' : 'secondary'} className="mt-1">
                          {company.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {company.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {company.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{company.catalogues_count} catalogues</span>
                      <span>{company.created_at}</span>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/provider/companies/${company.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(company.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No companies yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first company
              </p>
              <Button asChild>
                <Link href="/provider/companies/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Company
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProviderLayout>
  )
}
