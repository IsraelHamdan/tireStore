<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 *
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $vencimento
 * @property int $qtd_parcelas
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Venda newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Venda newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Venda query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Venda whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Venda whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Venda whereQtdParcelas($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Venda whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Venda whereVencimento($value)
 * @mixin \Eloquent
 */
class Venda extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'vendas';
    protected $fillable = [
        'parcelas',
        'vencimento_parcelas',
        'valor_total',
        'qtd_produto',
        'pagamento',
        'produto_id',
        'user_id',

    ];
    public $timestamps = true;
    protected $casts = [
        'id' => 'string',
        'produto_id'=>'string',
        'user_id'=>'string',
        'vencimento_parcelas' => 'array',
    ];

    public function users()
    {
        return $this->belongsTo(User::class);
    }
    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }
}
