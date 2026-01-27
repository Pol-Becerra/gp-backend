import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

export default function ConfigurationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Configuración</h1>
                <p className="text-text-secondary">Administra tus preferencias del sistema</p>
            </div>

            <div className="grid gap-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Notificaciones</CardTitle>
                        <CardDescription>Configura cómo recibes alertas sobre auditoría y cambios.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                            <Switch id="email-notifications" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="audit-logs">Alertas de Auditoría</Label>
                            <Switch id="audit-logs" defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Apariencia</CardTitle>
                        <CardDescription>Personaliza visualmente el sistema.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="dark-mode">Modo Oscuro</Label>
                            <Switch id="dark-mode" defaultChecked disabled />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button variant="outline">Cancelar</Button>
                    <Button className="bg-accent text-background hover:bg-accent-hover font-bold">
                        Guardar Cambios
                    </Button>
                </div>
            </div>
        </div>
    )
}
