/**
 * Full module question bank. Every major bullet in OS_Module4.pdf has at least
 * one question here, with feedback that explains the mechanism rather than
 * just naming the answer.
 */
const bank = [
  // ---- Memory basics and hardware ----
  {
    q: 'Where are instructions fetched from immediately before the CPU executes them?',
    o: ['Backing store', 'Main memory / cache', 'Page table only', 'TLB'], a: 1,
    e: 'The CPU can directly access registers, cache and main memory. Code on disk must be brought into memory first.'
  },
  {
    q: 'Main memory management is primarily concerned with…',
    o: ['Managing secondary storage', 'Managing primary memory so programs can run correctly', 'Scheduling disk arms', 'Compressing files'], a: 1,
    e: 'Memory consists of addressable bytes or words; the OS must allocate it to processes and protect it.'
  },
  {
    q: 'The base register holds…',
    o: ['The largest legal address', 'The smallest legal physical address', 'The size of a page', 'The disk block number'], a: 0,
    e: 'The limit register then gives the size of the range, so legal addresses are [base, base + limit).'
  },
  {
    q: 'The limit register specifies…',
    o: ['The number of frames', 'The size of the legal address range', 'The disk transfer rate', 'The process priority'], a: 1,
    e: 'Base + limit together define the protected range a user process may access.'
  },
  {
    q: 'With base 300040 and limit 120900, which address is legal?',
    o: ['299990', '300040', '420941', '120900'], a: 1,
    e: 'Legal range is 300040 through 420940 inclusive. 420941 is one past the end and traps.'
  },
  {
    q: 'Base and limit registers can be loaded only by…',
    o: ['Any user process', 'The linker', 'The OS using privileged kernel-mode instructions', 'The disk controller'], a: 2,
    e: 'Loading them is a privileged operation; user mode cannot change its own protection boundary.'
  },
  {
    q: 'Memory protection is enforced by hardware comparing…',
    o: ['Disk addresses with file sizes', 'Every user-mode memory address with base/limit', 'TLB tags with ASIDs', 'Page counts with frame counts'], a: 1,
    e: 'Every address generated in user mode is checked against the base and limit registers before it reaches memory.'
  },
  {
    q: 'With a relocation register of 14000, logical address 346 maps to physical…',
    o: ['346', '14000', '14346', '15400'], a: 2,
    e: 'The relocation register is added to every user address: 14000 + 346 = 14346. The user program never sees physical addresses.'
  },

  // ---- Address binding ----
  {
    q: 'Programs on disk waiting to enter main memory form the…',
    o: ['Ready queue', 'Input queue', 'Free-frame list', 'Balance set'], a: 1,
    e: 'The input queue holds binary executables waiting for memory; once loaded they join the ready queue.'
  },
  {
    q: 'In a source program, addresses are typically…',
    o: ['Absolute physical addresses', 'Symbolic names', 'Frame numbers', 'Disk block addresses'], a: 1,
    e: 'The compiler binds symbolic names to relocatable addresses; later stages bind them to physical addresses.'
  },
  {
    q: 'Compile-time binding…',
    o: ['Requires the physical location to be known when compiling', 'Allows the process to move at run time', 'Is performed by the loader only', 'Needs a TLB'], a: 0,
    e: 'If the load address is known in advance, absolute code can be generated — but any change forces recompilation.'
  },
  {
    q: 'Load-time binding produces…',
    o: ['Absolute code', 'Relocatable code', 'Bytecode', 'Microcode'], a: 1,
    e: 'Relocatable code can be placed at a different starting address by the loader without recompiling.'
  },
  {
    q: 'Execution-time binding is required when…',
    o: ['Code is never moved', 'A program is compiled to absolute addresses', 'A process may move during its execution', 'Static linking is used'], a: 2,
    e: 'Dynamic relocation, swapping and paging all need the logical-to-physical mapping to be decided at run time.'
  },

  // ---- Dynamic loading, linking and swapping ----
  {
    q: 'Dynamic loading means a routine is…',
    o: ['Loaded at compile time', 'Loaded only when it is first called', 'Copied into every executable', 'Placed on disk permanently'], a: 1,
    e: 'The main program checks whether the routine is resident; if not, the loader brings it in and control transfers to it.'
  },
  {
    q: 'A key advantage of dynamic loading is…',
    o: ['Unused routines never consume memory', 'The OS must manage every routine', 'All code is loaded before execution', 'It requires special hardware'], a: 0,
    e: 'Useful when large amounts of code handle infrequent cases; it needs no special OS support.'
  },
  {
    q: 'In dynamic loading, after finding a called routine is not resident, the main program…',
    o: ['Terminates', 'Swaps the whole process out', 'Calls the loader to bring the routine in', 'Recompiles itself'], a: 2,
    e: 'Step 4 of the module sequence: call the loader, then pass control to the newly loaded routine.'
  },
  {
    q: 'Static linking wastes memory because…',
    o: ['It stores only a stub', 'It includes whole library modules in each executable', 'It disables the TLB', 'It fragments the disk'], a: 1,
    e: 'Every program carries its own copy of the library code; dynamic linking stores only a stub instead.'
  },
  {
    q: 'A dynamic-linking stub is…',
    o: ['A small piece of code that locates the memory-resident library', 'A copy of the entire library', 'A page-table entry', 'A disk partition'], a: 0,
    e: 'At run time the stub resolves to the shared library routine already in memory.'
  },
  {
    q: 'Version information in programs and shared libraries…',
    o: ['Increases page size', 'Prevents programs from accidentally using an incompatible library', 'Replaces the MMU', 'Stops page faults'], a: 1,
    e: 'Both program and library carry version data so an upgrade cannot silently break callers.'
  },
  {
    q: 'Swapping moves…',
    o: ['A single page only', 'A whole process between memory and backing store', 'Only dirty frames', 'The page table to disk'], a: 1,
    e: 'A swapper handles entire processes; a pager handles individual pages in demand paging.'
  },
  {
    q: 'Priority-based swapping typically…',
    o: ['Rolls out a lower-priority process and rolls it in later', 'Deletes the lower-priority process', 'Increases the page size', 'Disables relocation'], a: 0,
    e: 'A high-priority arrival can free memory by rolling out a low-priority process, then rolling it back in.'
  },
  {
    q: 'Swapping to a different memory location is easiest with…',
    o: ['Compile-time binding', 'Load-time binding', 'Execution-time binding', 'Absolute code'], a: 2,
    e: 'Load-time binding fixes the address, so a swapped process must return to the same space; execution-time binding allows relocation.'
  },
  {
    q: 'Most of the time spent swapping is…',
    o: ['Context-switch overhead', 'TLB flush time', 'Transfer time proportional to the amount swapped', 'Page-table walk time'], a: 2,
    e: 'Swap time is dominated by disk transfer; latency and context switch are comparatively small.'
  },
  {
    q: 'If a process has pending I/O, the safe rule is…',
    o: ['Swap it immediately', 'Swap only its page table', 'Do not swap it, or perform the I/O only into OS buffers', 'Double the frame count'], a: 2,
    e: 'Otherwise the I/O could complete into the wrong memory location after the process has moved.'
  },

  // ---- Contiguous allocation and fragmentation ----
  {
    q: 'With contiguous allocation, each process occupies…',
    o: ['Many non-adjacent frames', 'One single contiguous section of memory', 'A hashed bucket', 'One TLB entry'], a: 1,
    e: 'The OS keeps the resident OS in one partition and gives each user process one unbroken region.'
  },
  {
    q: 'Fixed-sized partitioning limits…',
    o: ['The degree of multiprogramming to the number of partitions', 'The page size', 'The TLB hit ratio', 'The disk transfer rate'], a: 0,
    e: 'Each partition holds one process, so the partition count caps how many processes can be resident.'
  },
  {
    q: 'With variable-sized partitioning, the OS keeps…',
    o: ['A table of holes', 'A fixed page table per frame', 'A single base register', 'A linked list of TLB entries'], a: 0,
    e: 'The table records which regions are free; a hole is a block of available memory of some size.'
  },
  {
    q: 'First-fit allocation chooses…',
    o: ['The largest hole', 'The smallest adequate hole', 'The first hole that is big enough', 'A random hole'], a: 2,
    e: 'Searching may start at the beginning of the hole list or where the last search ended.'
  },
  {
    q: 'Best-fit allocation chooses…',
    o: ['The largest hole', 'The smallest hole that is big enough', 'The hole closest to the OS', 'The first hole'], a: 1,
    e: 'It minimises leftover space per allocation but tends to create many tiny unusable holes.'
  },
  {
    q: 'Worst-fit allocation chooses…',
    o: ['The largest hole', 'The smallest hole', 'The first hole', 'A fixed partition'], a: 0,
    e: 'It leaves large remnants but can exhaust large holes quickly.'
  },
  {
    q: 'Internal fragmentation occurs when…',
    o: ['Memory holes are too small to use', 'Allocated memory is slightly larger than requested', 'A page is on disk', 'The TLB is full'], a: 1,
    e: 'Fixed-size blocks waste the difference between the request and the block size.'
  },
  {
    q: 'The 50-percent rule says that with N allocated blocks, first fit loses about…',
    o: ['N blocks', '0.5N blocks', '2N blocks', 'No blocks'], a: 1,
    e: 'Statistical analysis shows roughly another half of the allocated blocks become unusable holes.'
  },
  {
    q: 'Compaction addresses external fragmentation by…',
    o: ['Shuffling memory to place free space together', 'Increasing the page size', 'Flushing the TLB', 'Writing all pages to disk'], a: 0,
    e: 'Compaction needs dynamic relocation so processes can be moved while they run.'
  },
  {
    q: 'The dispatcher loads relocation/base and limit registers when…',
    o: ['A process is compiled', 'A process is selected for execution', 'A page faults', 'The TLB fills'], a: 1,
    e: 'Loading them from the process context on each dispatch protects the OS and other processes.'
  },
  {
    q: 'Transient OS code exists mainly to…',
    o: ['Increase multiprogramming', 'Save memory by loading OS code only when needed', 'Remove external fragmentation', 'Speed up the disk'], a: 1,
    e: 'Code that comes and goes as needed reduces the memory permanently reserved for the OS.'
  },

  // ---- Paging ----
  {
    q: 'Paging divides a process into fixed-size…',
    o: ['Segments', 'Pages', 'Holes', 'Partitions'], a: 1,
    e: 'Physical memory is divided into frames of the same size, so any page can go into any frame.'
  },
  {
    q: 'Physical memory in paging is divided into fixed-size…',
    o: ['Frames', 'Buckets', 'Locality sets', 'Clusters'], a: 0,
    e: 'Frame and page sizes are identical and defined by the hardware.'
  },
  {
    q: 'The backing store is divided into blocks…',
    o: ['Larger than frames', 'Smaller than pages', 'The same size as memory frames', 'Equal to page tables'], a: 2,
    e: 'Equal-sized blocks make page-in/page-out transfers straightforward.'
  },
  {
    q: 'If logical space is 2^m and page size is 2^n, the offset uses…',
    o: ['m−n bits', 'n bits', 'm+n bits', '1 bit'], a: 1,
    e: 'The high m−n bits select the page; the low n bits are the offset carried through unchanged.'
  },
  {
    q: 'Paging eliminates…',
    o: ['Internal fragmentation entirely', 'External fragmentation', 'All disk I/O', 'The need for a page table'], a: 1,
    e: 'Any free frame works, so there are no scattered unusable holes. The last page may still waste space.'
  },
  {
    q: 'A 72,766-byte process with 2,048-byte pages wastes about…',
    o: ['1,086 bytes', '2,048 bytes', '962 bytes', '36 bytes'], a: 2,
    e: 'It needs 36 frames: 2,048 − 1,086 = 962 bytes of internal waste in the final frame.'
  },
  {
    q: 'A page table maps…',
    o: ['Page number to frame number', 'Frame number to disk block', 'Offset to protection bit', 'TLB tag to ASID'], a: 0,
    e: 'The frame number plus the unchanged offset forms the physical address.'
  },
  {
    q: 'Choosing a power-of-two page size makes…',
    o: ['Compaction unnecessary', 'Sharing impossible', 'Address splitting simple via bit fields', 'Page faults illegal'], a: 2,
    e: 'The logical address can be split into page and offset fields by taking bit slices.'
  },
  {
    q: 'A process needing n pages requires…',
    o: ['Exactly one frame', 'At least n free frames', 'No frames if it is small', 'A dedicated disk partition'], a: 1,
    e: 'Each page occupies one frame; all n frames must be available before the process is admitted.'
  },

  // ---- TLB, protection and page-table structures ----
  {
    q: 'A TLB is…',
    o: ['A small fast hardware cache of recent translations', 'A disk cache', 'A larger page table', 'A replacement algorithm'], a: 0,
    e: 'It stores recent page→frame mappings so most references avoid a page-table walk.'
  },
  {
    q: 'Each TLB entry consists of…',
    o: ['A segment and an offset', 'A tag (key) and a value (frame)', 'A page and a dirty bit', 'A process and a priority'], a: 1,
    e: 'The key is the page number; the value is the corresponding frame number.'
  },
  {
    q: 'Associative TLB lookup compares the page number with…',
    o: ['Only one key', 'All keys in parallel', 'The disk directory', 'The frame table only'], a: 1,
    e: 'Associative hardware searches all entries simultaneously, which is why it is fast and expensive.'
  },
  {
    q: 'A TLB hit means…',
    o: ['The page is on disk', 'The page fault handler ran', 'The frame number is available without a page-table walk', 'The page is invalid'], a: 2,
    e: 'The translation is already cached; the physical address can be formed immediately.'
  },
  {
    q: 'TLB hit ratio is…',
    o: ['Frames divided by pages', 'Percentage of page numbers found in the TLB', 'Disk transfers per second', 'Page faults per access'], a: 1,
    e: 'A higher ratio makes effective access time closer to a single memory access.'
  },
  {
    q: 'With an 80% hit ratio, 20 ns lookup and 100 ns memory access, EAT is…',
    o: ['100 ns', '120 ns', '140 ns', '220 ns'], a: 2,
    e: 'Hit = 120 ns, miss = 220 ns; 0.8×120 + 0.2×220 = 140 ns. At 98% it falls to 122 ns.'
  },
  {
    q: 'Which is NOT a TLB benefit listed in the module?',
    o: ['Faster translation', 'Lower power consumption', 'Fewer page-table accesses', 'Larger disk capacity'], a: 3,
    e: 'Benefits are faster access, lower latency, efficient virtual memory, lower power, fewer walks and better responsiveness.'
  },
  {
    q: 'Wired TLB entries…',
    o: ['Cannot be removed', 'Are always invalid', 'Store disk addresses', 'Are shared by all processes'], a: 0,
    e: 'Some TLBs reserve entries that cannot be evicted for critical mappings.'
  },
  {
    q: 'An ASID in a TLB entry…',
    o: ['Stores the page offset', 'Identifies the address space/process', 'Counts page faults', 'Marks the page dirty'], a: 1,
    e: 'The address-space identifier lets entries from different processes coexist without confusion.'
  },
  {
    q: 'A valid page-table entry means the page is…',
    o: ['On disk only', 'Legal and resident in memory', 'Read-only', 'In the TLB'], a: 1,
    e: 'Valid means both legal and currently in memory.'
  },
  {
    q: 'An invalid entry can mean…',
    o: ['The page is illegal or valid but currently on disk', 'The page is in the TLB', 'The frame is wired', 'The process is swapped out permanently'], a: 0,
    e: 'Accessing a valid-but-not-resident page causes a page fault; truly illegal pages cause termination.'
  },
  {
    q: 'Writing to a read-only page causes…',
    o: ['A TLB hit', 'A hardware trap to the OS', 'A compaction', 'A page-table walk only'], a: 1,
    e: 'Protection bits are checked at the same time the physical address is computed.'
  },
  {
    q: 'Re-entrant (pure) code…',
    o: ['Modifies itself frequently', 'Is private to one process', 'Never changes during execution', 'Must be paged out'], a: 2,
    e: 'Because it never changes, many processes can safely execute the same physical copy.'
  },
  {
    q: 'With shared pages, each process keeps…',
    o: ['Its own copy of the code', 'Its own data and registers but maps the same code frame', 'The same page table entirely', 'No page table'], a: 1,
    e: 'One copy of an editor’s pure code serves all users; data pages remain private.'
  },
  {
    q: 'A hierarchical page table is used mainly to…',
    o: ['Avoid a huge flat page table', 'Speed up the disk', 'Implement LRU', 'Increase page size'], a: 0,
    e: 'Paging the page table itself keeps each piece small; 32-bit/4 KB splits the page number into 10+10 bits.'
  },
  {
    q: 'A hashed page-table entry contains…',
    o: ['Base and limit', 'Virtual page number, frame, and chain pointer', 'Segment name and offset', 'Dirty and valid bits only'], a: 1,
    e: 'Collisions are resolved by a linked list of entries with the same hash value.'
  },
  {
    q: 'An inverted page table has…',
    o: ['One entry per virtual page', 'One entry per physical frame', 'One entry per process', 'One entry per TLB slot'], a: 1,
    e: 'Each entry records which <process-id, page-number> occupies that frame.'
  },
  {
    q: 'A drawback of inverted page tables is…',
    o: ['They use too much memory', 'Searching takes longer and shared memory is difficult', 'They eliminate paging', 'They require compaction'], a: 1,
    e: 'Memory use is low, but lookups are slower and sharing a frame between processes is hard to represent.'
  },

  // ---- Segmentation ----
  {
    q: 'A logical address under segmentation consists of…',
    o: ['Page number and offset', 'Segment number and offset', 'Frame number and page', 'Base and limit only'], a: 1,
    e: 'The segment number indexes the segment table; the offset is checked against the limit.'
  },
  {
    q: 'A segment-table entry provides…',
    o: ['Base and limit', 'Page and frame', 'Tag and value', 'Reference and modify bits'], a: 0,
    e: 'Base is the starting physical address; limit is the segment length.'
  },
  {
    q: 'Segment 2 has base 4300 and limit 400. Offset 53 maps to…',
    o: ['4300', '4353', '4700', 'Trap'], a: 1,
    e: '53 < 400, so physical address = 4300 + 53 = 4353.'
  },
  {
    q: 'Segment 0 has limit 1000. Offset 1222 causes…',
    o: ['A page fault', 'A trap to the OS', 'A TLB miss', 'Compaction'], a: 1,
    e: 'The offset is outside the legal range, so hardware traps before forming a physical address.'
  },
  {
    q: 'Segmentation’s main trade-off is…',
    o: ['It brings back external fragmentation', 'It removes all protection', 'It requires no address translation', 'It cannot share code'], a: 0,
    e: 'Variable-length segments are user-friendly and shareable, but holes can accumulate.'
  },

  // ---- Virtual memory and demand paging ----
  {
    q: 'Virtual memory is the separation of…',
    o: ['Cache and registers', 'Logical memory from physical memory', 'Disk from tape', 'Kernel from user stack'], a: 1,
    e: 'Programs see a private logical address space that need not match physical memory.'
  },
  {
    q: 'Virtual memory is implemented using…',
    o: ['Demand paging', 'Fixed partitioning', 'Static linking', 'Worst fit'], a: 0,
    e: 'Pages are brought in only when referenced, allowing partially resident processes.'
  },
  {
    q: 'A pager moves…, whereas a swapper moves…',
    o: ['Pages; whole processes', 'Whole processes; pages', 'Frames; TLB entries', 'Segments; pages'], a: 0,
    e: 'Demand paging uses a lazy pager; swapping uses a swapper for entire process images.'
  },
  {
    q: 'Pure demand paging starts with…',
    o: ['All pages loaded', 'No pages loaded', 'Only code pages loaded', 'The page table on disk'], a: 1,
    e: 'Initially every PTE is invalid; the first access to each page causes a fault.'
  },
  {
    q: 'The first step in handling a page fault is to…',
    o: ['Restart the instruction', 'Check whether the address is valid', 'Choose a victim immediately', 'Flush the TLB'], a: 1,
    e: 'An invalid address terminates the process; a valid-but-absent page continues.'
  },
  {
    q: 'The last step in handling a page fault is to…',
    o: ['Terminate the process', 'Restart the faulting instruction', 'Compact memory', 'Disable paging'], a: 1,
    e: 'The instruction that faulted is re-executed from the beginning after the page is resident.'
  },
  {
    q: 'With p = 0.001, 200 ns memory and 8 ms fault service, EAT is…',
    o: ['200 ns', '8.2 µs', '8 ms', '40 µs'], a: 1,
    e: 'EAT = 0.999×200 ns + 0.001×8,000,000 ns ≈ 8.2 µs, about 40× slower than a hit.'
  },

  // ---- Copy-on-write and replacement ----
  {
    q: 'Copy-on-write initially lets parent and child…',
    o: ['Share the same physical pages', 'Use different disks', 'Have separate page tables disabled', 'Swap out immediately'], a: 0,
    e: 'After fork, both map the same frames until one process writes.'
  },
  {
    q: 'A copy-on-write fault causes…',
    o: ['The process to abort', 'A fresh private page to be allocated', 'The TLB to be disabled', 'The page table to be deleted'], a: 1,
    e: 'The OS allocates a new page for the writer; the parent keeps the original.'
  },
  {
    q: 'Zero-on-fill means new pages are…',
    o: ['Copied from disk', 'Erased before being given to a process', 'Marked read-only permanently', 'Placed in the TLB'], a: 1,
    e: 'A fresh page must not leak the previous contents of its frame.'
  },
  {
    q: 'A victim page is…',
    o: ['The page brought in first', 'The page selected to be removed from memory', 'The page in the TLB', 'The page table itself'], a: 1,
    e: 'If no free frame exists, the replacement algorithm picks a victim to page out.'
  },
  {
    q: 'The modify (dirty) bit is set by hardware when…',
    o: ['A page is read', 'A page is written', 'A page enters the TLB', 'A frame is freed'], a: 1,
    e: 'A dirty page differs from its disk copy and must be written back before eviction.'
  },
  {
    q: 'A clean victim can be discarded without a disk write because…',
    o: ['It is read-only', 'It is in the TLB', 'It belongs to the OS', 'The disk copy is still current'], a: 3,
    e: 'If the modify bit is 0, memory matches disk, saving one page transfer.'
  },
  {
    q: 'FIFO replacement evicts…',
    o: ['The least recently used page', 'The page with the smallest count', 'The oldest-loaded page', 'The page with the farthest next use'], a: 2,
    e: 'FIFO associates each page with the time it entered memory and replaces the oldest.'
  },
  {
    q: 'Belady’s anomaly means…',
    o: ['FIFO always beats LRU', 'More frames can cause more page faults with FIFO', 'OPT causes faults', 'LRU is not a stack algorithm'], a: 1,
    e: 'FIFO is not a stack algorithm. LRU and OPT cannot show this anomaly.'
  },
  {
    q: 'Optimal replacement evicts the page…',
    o: ['Whose next use is farthest in the future', 'That arrived first', 'With the smallest count', 'That is dirty'], a: 0,
    e: 'OPT gives the minimum fault rate but needs future knowledge, so it is a benchmark.'
  },
  {
    q: 'LRU evicts the page…',
    o: ['Used most recently', 'Least recently used', 'With the largest size', 'On disk already'], a: 1,
    e: 'LRU looks backwards in time as an approximation of OPT.'
  },
  {
    q: 'Two hardware approaches to implementing LRU are…',
    o: ['Counters and a stack', 'Hashing and sorting', 'Compaction and swapping', 'TLB and ASID'], a: 0,
    e: 'Counters timestamp each access; a stack moves the referenced page to the top.'
  },
  {
    q: 'The additional-reference-bits algorithm samples the reference bit…',
    o: ['On every fault', 'Every 100 ms', 'Only at boot', 'When the TLB fills'], a: 1,
    e: 'An 8-bit history register is shifted periodically; 11000100 is more recently used than 01110111.'
  },
  {
    q: 'Second-chance replacement…',
    o: ['Evicts the first page with reference bit 1', 'Clears the bit of a referenced page and gives it another chance', 'Uses future knowledge', 'Always chooses the oldest page'], a: 1,
    e: 'A circular FIFO scan skips pages whose bit is 1, clearing it as it passes.'
  },
  {
    q: 'Enhanced second chance classifies pages using…',
    o: ['Reference and modify bits', 'Page and frame numbers', 'Base and limit', 'Process and priority'], a: 0,
    e: 'Classes (0,0), (0,1), (1,0), (1,1) prefer clean, unreferenced victims.'
  },
  {
    q: 'LFU replaces the page with…',
    o: ['Smallest access count', 'Largest access count', 'Oldest load time', 'Farthest next use'], a: 0,
    e: 'It can keep a page that was hot early in a process’s life but is now dead.'
  },
  {
    q: 'MFU is motivated by the idea that…',
    o: ['Frequently used pages should stay', 'A low-count page may have just been loaded', 'FIFO is optimal', 'Dirty pages are cheap'], a: 1,
    e: 'MFU argues the smallest-count page was probably just brought in and not yet used heavily.'
  },

  // ---- Allocation, NUMA, thrashing ----
  {
    q: 'Equal frame allocation gives each of n processes…',
    o: ['m × n frames', 'm / n frames', 'All m frames', 'One frame'], a: 1,
    e: 'Free frames are divided evenly, with remainders kept in a free-frame pool.'
  },
  {
    q: 'Proportional allocation gives process i…',
    o: ['m / n frames', 'm × Sᵢ / ΣS frames', 'Sᵢ frames', 'ΣS / m frames'], a: 1,
    e: 'The module example: 62 frames with sizes 10 KB and 127 KB gives about 4 and 57 frames.'
  },
  {
    q: 'With local replacement, a process…',
    o: ['Can evict any page in memory', 'Only evicts frames allocated to itself', 'Uses a global free list', 'Never faults'], a: 1,
    e: 'Local replacement gives predictable fault rates but can underuse free frames held by other processes.'
  },
  {
    q: 'Global replacement is more common because…',
    o: ['It is simpler and more efficient overall', 'It guarantees fixed fault rates', 'It disables paging', 'It requires no page table'], a: 0,
    e: 'Any frame can be a victim, so memory is used more flexibly.'
  },
  {
    q: 'NUMA means…',
    o: ['All memory has equal access time', 'Local memory is faster than memory on another CPU board', 'Only one CPU may access RAM', 'Paging is disabled'], a: 1,
    e: 'Placement matters because crossing the interconnect slows memory access.'
  },
  {
    q: 'A thrashing process spends more time…',
    o: ['Compacting than executing', 'Paging than executing', 'Linking than loading', 'Swapping than faulting'], a: 1,
    e: 'It faults continuously, replacing pages it will immediately need again.'
  },
  {
    q: 'The usual cure for thrashing is…',
    o: ['Increase multiprogramming', 'Reduce multiprogramming or allocate more frames', 'Disable the TLB', 'Use worst fit'], a: 1,
    e: 'Suspending a process frees frames; working-set or PFF schemes keep the system healthy.'
  },
  {
    q: 'On the CPU-utilisation curve, utilisation collapses when…',
    o: ['The degree of multiprogramming is low', 'Frames exceed the working set', 'Thrashing sets in', 'The page table is hashed'], a: 2,
    e: 'Utilisation rises with multiprogramming until working sets no longer fit, then drops sharply.'
  },

  // ---- Locality, working set and page-fault frequency ----
  {
    q: 'A locality is…',
    o: ['A set of pages actively used together', 'A fixed partition', 'A disk block', 'A TLB entry'], a: 0,
    e: 'Programs move between overlapping localities created by loops and data-structure traversal.'
  },
  {
    q: 'A reference string is…',
    o: ['The ordered list of page numbers accessed', 'The list of free frames', 'The page-table base register', 'The swap-time formula'], a: 0,
    e: 'Replacement algorithms are evaluated by replaying a reference string.'
  },
  {
    q: 'Spatial locality means…',
    o: ['Recently used pages are likely used again', 'Nearby addresses are likely accessed together', 'Pages on other CPUs are faster', 'Fault rate is zero'], a: 1,
    e: 'Arrays and sequential code exhibit spatial locality.'
  },
  {
    q: 'Temporal locality means…',
    o: ['Nearby addresses are used', 'Recently used pages tend to be reused', 'Pages never repeat', 'Disk is slower than RAM'], a: 1,
    e: 'Loops and repeated calls exhibit temporal locality.'
  },
  {
    q: 'In the handout’s working-set example, the early set is…',
    o: ['{1,2,5,6,7}', '{3,4}', '{0,1,2}', 'All pages'], a: 0,
    e: 'A later window narrows to {3,4}; the working set approximates current locality.'
  },
  {
    q: 'A process can execute only while…',
    o: ['Its working set is resident', 'Its page table is on disk', 'Its TLB is full', 'It has no dirty pages'], a: 0,
    e: 'Pages outside the working set may be discarded at any moment.'
  },
  {
    q: 'The balance set is…',
    o: ['The active group of runnable processes', 'The set of free frames', 'The set of dirty pages', 'The OS kernel pages'], a: 0,
    e: 'If the sum of all working sets exceeds memory, some processes are held inactive.'
  },
  {
    q: 'If page-fault frequency is above the upper bound…',
    o: ['Remove a frame', 'Do nothing', 'Allocate another frame or suspend the process', 'Disable the process’s TLB'], a: 2,
    e: 'A high fault rate means the process needs more frames for its working set.'
  },
  {
    q: 'If page-fault frequency is below the lower bound…',
    o: ['Add a frame', 'Remove a frame', 'Suspend the process', 'Increase the working set window'], a: 1,
    e: 'A low fault rate suggests the process holds more frames than it needs.'
  }
];

// Fisher–Yates: the module is evaluated once per page load, so every reload
// gives a fresh question order.
function shuffled(items) {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Spread the correct option across A–D so the bank does not teach a position bias.
export const quizQuestions = shuffled(bank).map((item, i) => {
  const options = item.o.slice();
  const [correct] = options.splice(item.a, 1);
  const target = i % item.o.length;
  options.splice(target, 0, correct);
  return { ...item, o: options, a: target };
});
