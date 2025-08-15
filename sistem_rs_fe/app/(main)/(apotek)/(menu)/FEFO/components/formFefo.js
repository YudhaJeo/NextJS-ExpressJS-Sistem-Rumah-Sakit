// 'use client';

// import { Dialog } from 'primereact/dialog';
// import { Dropdown } from 'primereact/dropdown';
// import { InputNumber } from 'primereact/inputnumber';
// import { Calendar } from 'primereact/calendar';
// import { Button } from 'primereact/button';

// export default function FormFefo({ visible, onHide, onSubmit, form, setForm, errors, obatOptions, alkesOptions }) {
//   const tipeOptions = [
//     { label: 'Obat', value: 'OBAT' },
//     { label: 'Alkes', value: 'ALKES' },
//   ];

//   const itemOptions = form.TIPE === 'OBAT' ? obatOptions : alkesOptions;

//   return (
//     <Dialog
//       header={form.IDBATCH ? "Edit Batch FEFO" : "Tambah Batch FEFO"}
//       visible={visible}
//       onHide={onHide}
//       style={{ width: '30vw' }}
//     >
//       <form
//         className="space-y-3"
//         onSubmit={(e) => {
//           e.preventDefault();
//           onSubmit();
//         }}
//       >
//         <div>
//           <label>Tipe Item</label>
//           <Dropdown
//             className="w-full mt-2"
//             options={tipeOptions}
//             value={form.TIPE}
//             onChange={(e) => setForm({ ...form, TIPE: e.value, ITEMID: null })}
//           />
//         </div>

//         <div>
//           <label>Nama Item</label>
//           <Dropdown
//             className="w-full mt-2"
//             options={itemOptions}
//             value={form.ITEMID ?? null}
//             onChange={(e) => setForm({ ...form, ITEMID: e.value })}
//             placeholder="Pilih Item"
//           />
//           {errors.ITEMID && <small className="text-red-500">{errors.ITEMID}</small>}
//         </div>

//         <div>
//           <label>Stok</label>
//           <InputNumber
//             className="w-full mt-2"
//             value={form.STOK}
//             onValueChange={(e) => setForm({ ...form, STOK: e.value })}
//           />
//         </div>

//         <div>
//           <label>Tanggal Kadaluarsa</label>
//           <Calendar
//             className="w-full mt-2"
//             value={form.TGLKADALUARSA ? new Date(form.TGLKADALUARSA) : null}
//             onChange={(e) =>
//               setForm({ ...form, TGLKADALUARSA: e.value?.toISOString().split('T')[0] || '' })
//             }
//             dateFormat="yy-mm-dd"
//             showIcon
//           />
//           {errors.TGLKADALUARSA && <small className="text-red-500">{errors.TGLKADALUARSA}</small>}
//         </div>

//         <div>
//           <label>Harga Beli</label>
//           <InputNumber
//             className="w-full mt-2"
//             value={form.HARGABELI}
//             onValueChange={(e) => setForm({ ...form, HARGABELI: e.value })}
//             mode="currency" currency="IDR" locale="id-ID"
//           />
//         </div>

//         <div>
//           <label>Harga Jual</label>
//           <InputNumber
//             className="w-full mt-2"
//             value={form.HARGAJUAL}
//             onValueChange={(e) => setForm({ ...form, HARGAJUAL: e.value })}
//             mode="currency" currency="IDR" locale="id-ID"
//           />
//         </div>

//         <div className="text-right pt-3">
//           <Button type="submit" label="Simpan" icon="pi pi-save" />
//         </div>
//       </form>
//     </Dialog>
//   );
// }