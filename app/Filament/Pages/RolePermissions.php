<?php
 
namespace App\Filament\Pages;
 
use Filament\Pages\Page;
use App\Models\Config;
use Illuminate\Support\Facades\Cache;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\CheckboxList;
use Filament\Actions\Action;
 
class RolePermissions extends Page implements HasForms
{
    use InteractsWithForms;
 
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-shield-check';
 
    protected string $view = 'filament.pages.role-permissions';
 
    protected static ?string $navigationLabel = 'Hak Akses Divisi';
 
    protected static ?string $title = 'Pengaturan Hak Akses Divisi';
 
    protected static string | \UnitEnum | null $navigationGroup = 'Sistem';
 
    protected static ?int $navigationSort = 3;
 
    public ?array $data = [];
 
    public array $roles = [
        'po' => 'Project Officer (PO)',
        'sc' => 'Steering Committee (SC)',
        'event' => 'Divisi Acara (Event)',
        'humas' => 'Divisi Humas',
        'bendahara' => 'Bendahara',
        'sekretaris' => 'Sekretaris'
    ];
 
    public array $modules = [
        'lomba' => 'Manajemen Lomba',
        'syarat_berkas' => 'Persyaratan Berkas',
        'pendaftaran' => 'Verifikasi Pendaftaran',
        'mitra' => 'Manajemen Mitra/Sponsor',
        'timeline' => 'Manajemen Timeline',
        'season' => 'Manajemen Season/Galeri',
        'pengumuman' => 'Pengiriman Pengumuman',
        'pengguna' => 'Data Pengguna'
    ];
 
    public function mount(): void
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }
 
        $config = Config::where('key', 'role_permissions')->first();
        $permissions = [];
        if ($config && $config->value) {
            $permissions = json_decode($config->value, true) ?: [];
        }
 
        $state = [];
        foreach (array_keys($this->roles) as $r) {
            foreach (array_keys($this->modules) as $m) {
                $state["{$r}_{$m}"] = $permissions[$r][$m] ?? [];
            }
        }
 
        $this->form->fill($state);
    }
 
    public function form(Schema $form): Schema
    {
        $sections = [];
        foreach ($this->roles as $roleKey => $roleLabel) {
            $moduleFields = [];
            foreach ($this->modules as $moduleKey => $moduleLabel) {
                $moduleFields[] = CheckboxList::make("{$roleKey}_{$moduleKey}")
                    ->label($moduleLabel)
                    ->options([
                        'view' => 'Lihat',
                        'create' => 'Tambah',
                        'update' => 'Ubah',
                        'delete' => 'Hapus',
                    ])
                    ->columns(4);
            }
 
            $sections[] = Section::make($roleLabel)
                ->description("Hak akses divisi {$roleLabel}")
                ->schema($moduleFields)
                ->collapsible();
        }
 
        return $form
            ->schema($sections)
            ->statePath('data');
    }
 
    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Perubahan')
                ->submit('save')
                ->color('primary')
                ->keyBindings(['mod+s']),
        ];
    }
 
    public function save(): void
    {
        $formData = $this->form->getState();
        
        $permissions = [];
        foreach (array_keys($this->roles) as $r) {
            $permissions[$r] = [];
            foreach (array_keys($this->modules) as $m) {
                $permissions[$r][$m] = $formData["{$r}_{$m}"] ?? [];
            }
        }
 
        Config::updateOrCreate(
            ['key' => 'role_permissions'],
            [
                'value' => json_encode($permissions),
                'keterangan' => 'Pengaturan Hak Akses Divisi (Permissions)',
                'updated_at' => now(),
            ]
        );
 
        Cache::forget('role_permissions');
 
        \Filament\Notifications\Notification::make()
            ->title('Hak akses divisi berhasil diperbarui!')
            ->success()
            ->send();
    }
}
