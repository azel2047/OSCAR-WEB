<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: #333333;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }
        
        .header {
            margin-bottom: 25px;
            border-bottom: 2px solid #70C492;
            padding-bottom: 10px;
        }
        
        .header table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .header-title {
            font-size: 18px;
            font-weight: bold;
            color: #112C1E;
        }
        
        .header-subtitle {
            font-size: 12px;
            color: #70C492;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 3px;
            font-weight: bold;
        }
        
        .header-meta {
            text-align: right;
            font-size: 10px;
            color: #666666;
        }
        
        .summary-box {
            background-color: #f4faf6;
            border: 1px solid #d3efe0;
            border-radius: 4px;
            padding: 8px 12px;
            margin-bottom: 20px;
            font-size: 10px;
        }
        
        .summary-box table {
            width: 100%;
        }
        
        .summary-box td {
            padding: 2px 0;
        }
        
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        table.data-table th {
            background-color: #112C1E;
            color: #ffffff;
            font-weight: bold;
            text-align: left;
            padding: 8px 6px;
            border: 1px solid #112C1E;
            font-size: 10px;
            text-transform: uppercase;
        }
        
        table.data-table td {
            padding: 7px 6px;
            border: 1px solid #dddddd;
            vertical-align: top;
        }
        
        table.data-table tr:nth-child(even) td {
            background-color: #f9fbf9;
        }
        
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .badge-pending {
            background-color: #fef3c7;
            color: #d97706;
        }
        
        .badge-diverifikasi {
            background-color: #d1fae5;
            color: #059669;
        }
        
        .badge-ditolak {
            background-color: #fee2e2;
            color: #dc2626;
        }
        
        .footer {
            position: fixed;
            bottom: -15px;
            left: 0;
            right: 0;
            height: 20px;
            text-align: center;
            font-size: 9px;
            color: #999999;
            border-top: 1px solid #eeeeee;
            padding-top: 5px;
        }
        
        .page-number:after {
            content: counter(page);
        }
    </style>
</head>
<body>

    <div class="header">
        <table>
            <tr>
                <td>
                    <div class="header-title">OSCAR 3.0</div>
                    <div class="header-subtitle">Season Rainforest</div>
                </td>
                <td class="header-meta">
                    <strong>Dokumen:</strong> Laporan Pendaftaran Peserta<br>
                    <strong>Tanggal Cetak:</strong> {{ $date }}
                </td>
            </tr>
        </table>
    </div>

    <div class="summary-box">
        <table>
            <tr>
                <td><strong>Total Records:</strong> {{ count($records) }} Pendaftaran</td>
                <td style="text-align: right;"><strong>Status Ekspor:</strong> Sukses</td>
            </tr>
        </table>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 15%;">Nomor Reg</th>
                <th style="width: 20%;">Nama Pendaftar</th>
                <th style="width: 15%;">Email / No. HP</th>
                <th style="width: 10%;">Tingkat</th>
                <th style="width: 15%;">Cabang Lomba</th>
                <th style="width: 10%;">Status</th>
                <th style="width: 10%;">Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($records as $index => $record)
                <tr>
                    <td style="text-align: center;">{{ $index + 1 }}</td>
                    <td style="font-weight: bold; font-family: monospace;">{{ $record->nomor }}</td>
                    <td>{{ $record->user?->nama ?? '-' }}</td>
                    <td>
                        {{ $record->user?->email ?? '-' }}<br>
                        <span style="color: #666666; font-size: 10px;">{{ $record->user?->no_hp ?? '-' }}</span>
                    </td>
                    <td>
                        <span style="text-transform: capitalize;">{{ $record->user?->kategori ?? '-' }}</span>
                    </td>
                    <td>{{ $record->lomba?->nama ?? '-' }}</td>
                    <td style="text-align: center;">
                        <span class="badge badge-{{ $record->status }}">
                            {{ $record->status }}
                        </span>
                    </td>
                    <td>{{ $record->created_at?->format('d/m/y H:i') ?? '-' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Laporan Pendaftaran OSCAR 3.0 — Halaman <span class="page-number"></span>
    </div>

</body>
</html>
